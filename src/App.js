import Header from "./components/Header";
import { createBrowserRouter,Outlet } from "react-router-dom";
import Home from "./components/Home";
import CreateGlossary from "./components/CreateGlossary";


function App() {
  return <div className="m-5">
    <Header/>
    <Outlet/>
  </div>;
}

const appRoute = createBrowserRouter([
  {
      path:"/",
      element: <App/>,
      children:[{
        path : "/",
        element : <Home/>
      },{
        path:"/newglossary",
        element : <CreateGlossary/>
      }]
      // children : [{
      //     path:"/",
      //     element:<RestroDetails/>
      // }, {
      //     path:"/contact",
      //     element:<ContactUs/>
  
      // },
      // {
      //     path:"/restro/:id",
      //     element:<Restro/>
      // }
  // ]
  },
 
])

export default appRoute;
