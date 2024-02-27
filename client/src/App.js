import "./App.css"
import Header from "./components/view/header/header"
import Search from "./components/view/search/search"
import Result from "./components/view/result/result"

function App() {
  return (
    <div className="App">
      <div className="wrapper">
        <div>
          <Header/>
        </div>
        <div className="body">
          <Search/>
          <Result/>
        </div>
      </div>
    </div>
  );
}

export default App;
