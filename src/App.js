import React from 'react';
import logo from './logo.svg';
import './App.css';
import $ from 'jquery'
import MaterialIcon, {colorPalette} from 'material-icons-react';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      city: "",
      temp:'',
      res_city:'',
    };
  }

  handle = e => {
    this.setState({
      city: e.target.value,
      temp:'',
      res_city:'',
      curr_city:null,
      curr_temp:null
    });
  };

  get_weather = () => {
    $.ajax({
      async: true,
      url: "http://192.168.0.102:8000/getweather",
      type: "post",
      data: {city:this.state.city},
      success: response=>{ this.setState(prev=>({...prev,temp:response.temp,res_city:response.city})) },
      fail:er=>{
        console.log(er)
      }
  })
  };

  get=()=>{
    this.get_weather()
  }

  get_location=()=>{
    navigator.geolocation.getCurrentPosition((res)=>{
      const { coords } = res
      $.ajax({
        async: true,
        type:"post",
        url:'http://192.168.0.102:8000/getcity',
        data: { long : coords.longitude, lat: coords.latitude},
        success: response=>{ this.setState(prev=>({...prev,curr_temp:response.temp,curr_city:response.city})) },
        fail:er=>{
          console.log(er)
        }
      })
    },
    (err)=>{alert(JSON.stringify(err))},
    {maximumAge:600000})
  }

  componentWillMount(){
    this.get_location()
  }


  
  render() {
    var date=new Date()
    return (
      <div className="App" style={{background:`linear-gradient(to bottom, rgb(0,0,0,0.9), rgb(0, 0, 0, 0.5)),url(https://source.unsplash.com/1600x900/?${this.state.res_city})`}}>
        <div className="top">
            <div className="top-temp">
              <div className="top-temp-left">
                <MaterialIcon icon="wb_sunny" color={colorPalette.amber.A700} />
              </div>
              <div className="top-temp-right">
                <h3 className="city-name remove-line" style={{color:'white',fontFamily:'sans-serif'}}>31<sup>o</sup> C</h3>
                <p className="city-temp remove-line" style={{color:'white',fontFamily:'sans-serif'}}>Mumbai</p>
              </div>
            </div>
            <div className="top-time">
              <p style={{color:'white',fontFamily:'sans-serif'}}>{date.toDateString()}</p>
            </div>
        </div>
        <div className="main-box">
          <input
            onLoad={(e)=>e.target.focus()}
            type="text"
            onChange={this.handle}
            placeholder="Enter City Name"
            className="outline"
          />
          <br />
          <button className="outline" style={{background:'#167a8b',color:'white',border:'none'}} onClick={this.get}>Get Weather</button>
          {
            this.state.temp!==""
            ?
            <p style={{color:'white',fontFamily:'sans-serif'}}>It's {this.state.temp} <sup>o</sup>C in {this.state.res_city}!</p>
            :
            null
          }
        </div>
      </div>
    );
  }
}

export default App;
