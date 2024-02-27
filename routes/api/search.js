const Router = require("express").Router()
const TimeModel = require("../../models/TimeModel")
const TripModel = require("../../models/TripModel")
const RouteModel = require("../../models/RouteModel")
const StopModel = require("../../models/StopModel")
const RegionModel = require("../../models/RegionModel")
const { Op } = require("sequelize")

Router.get('/region/:region', async (req,res) => {
    try{
        let region = getFromRequest(req.params.region)
        return res.status(200).json(
            await RegionModel.findAll({
                where:{
                    name: {
                        [Op.like]: `%${region}%`
                    }
                },
            })
        )
    }catch (e){
        console.error(e)
        return generateError(res, e, 500)
    }
})

Router.post('/stops/:stopName?', async (req,res) => {
    try{
        let regionId = getFromRequest(req.body.region)
        let stopName = req.params.stopName
        if(stopName === undefined) stopName = ""

        return res.status(200).json(
            await StopModel.findAll({
                where:{
                    name: {
                        [Op.like]: `%${stopName}%`
                    },
                    stop_area: regionId
                }
            })
        )

    }catch (e){
        console.error(e)
        return generateError(res, e, 500)
    }
})

Router.get('/bus/:stopId?', async (req,res) => {
    try{
        let stop_id = getFromRequest(req.params.stopId)
        let stops = await StopModel.findAll({
            where: {
                id: stop_id
            },
            include: [
                {
                    model: TimeModel,
                    include: {
                        model: TripModel,
                        include: {
                            model: RouteModel
                        }
                    }
                },
            ]
        })
        let unique = []
        stops.forEach( stop => {
            for(let time of stop.times){
                if(unique.indexOf(time.trip.route.bus) == -1){
                    unique.unshift({
                        name: time.trip.route.bus
                    })
                }
            }
        })
        return res.status(200).json(unique)
    }catch (e){
        console.error(e)
        return generateError(res, e, 500)
    }
})

Router.post('/bus-times/', async (req,res) => {
    try{
        let stop_id = getFromRequest(req.body.stopId)
        let bus_name = getFromRequest(req.body.busName)
        let times = await TimeModel.findAll({
            where: {
                stop_id: stop_id
            },
            order: [["arrival_time", "ASC"]],
            include: [
                {
                    model: TripModel,
                    include: {
                        model: RouteModel,
                        where: {
                            bus: bus_name
                        },
                    },
                }
            ]
        })

        let sorted_times = times.filter(time => time.trip != null)
        return res.status(200).json(sorted_times)
    }catch (e){
        console.error(e)
        return generateError(res, e, 500)
    }
})

Router.get('/trip-info/:tripId', async (req,res) => {
    try{
        let tripId = getFromRequest(req.params.tripId)
        let times = await TripModel.findOne({
            where: {
                id: tripId
            },
            include: [
                {
                    order: [["arrival_time", "ASC"]],
                    model: TimeModel,
                    include: {
                        model: StopModel
                    }
                },
            ]
        })

        return res.status(200).json(times)
    }catch (e){
        console.error(e)
        return generateError(res, e, 500)
    }
})

Router.get('/geo-location/:lat/:lon', async (req,res) => {
    try{
        let lat = parseFloat(getFromRequest(req.params.lat))
        let lon = parseFloat(getFromRequest(req.params.lon))

        let counter = 0.003000
        let forSearch = {
            latUp: lat + counter,
            latDown: lat - counter,
            lonLeft: lon - counter,
            lonRight: lon + counter
        }

        let stops = await StopModel.findAll({
            where: {
                [Op.and]: [
                    {
                        stop_lat: {
                            [Op.gte]: forSearch.latDown
                        }
                    },
                    {
                        stop_lat: {
                            [Op.lte]: forSearch.latUp
                        }
                    },
                    {
                        stop_lon: {
                            [Op.gte]: forSearch.lonLeft
                        }
                    },
                    {
                        stop_lon: {
                            [Op.lte]: forSearch.lonRight
                        }
                    }
                ],
            },
            include: {
                model: RegionModel
            }
        })

        let approximations = []

        stops.forEach(stop => {
            let a = 0
            let b = 0
            if(stop.stop_lat > lat){
                a = stop.stop_lat - lat
            }else {
                a = lat - stop.stop_lat
            }

            if(stop.stop_lon > lon){
                a = stop.stop_lon - lon
            }else {
                a = lon - stop.stop_lon
            }

            approximations.unshift({
                approximation: Math.sqrt(a**2 + b**2),
                stop: stop
            })
        })

        //find most nearest stop
        let min = null
        for(let data of approximations){
            if(min == null){
                min = data
                continue
            }
            if(data.approximation < min.approximation){
                min = data
            }
        }

        return res.status(200).json(min.stop)
    }catch (e){
        console.error(e)
        return generateError(res, e, 500)
    }
})

module.exports = Router

function generateError(res, e, statusCode){
    let payload = {msg: "Internal server error"}
    if (process.env.DEBUG === "1"){
        payload.error = e.toString()
        payload.stack = e.stack.toString()
    }
    return res.status(statusCode).json(payload)
}

function getFromRequest(variable){
    if(variable == null && variable == undefined) throw new Error("All field is required")
    return variable
}
