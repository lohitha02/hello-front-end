import React from 'react';
import NavBar from "../components/NavBar";
import Map from "../components/dashboard/Map";
import { withScriptjs } from "react-google-maps";
import dataFetch from '../utils/dataFetch';
import Cookies from 'universal-cookie';
import { GoogleComponent } from 'react-google-location';

const API_KEY = 'AIzaSyCaK8qoLfQ8WW7M4XGe60O1_LpVrBE6yyk'

const cookies = new Cookies();

const query = `
mutation createTravel($token: String!, $from: String! , $to: String! ) {
   createTravel(token: $token, from: $from , to: $to) {
    _id
    from
    to
  }
}
`;

class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            from: '',
            to: '',
            search: false,
        };
        this.handleSearch = this.handleSearch.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    }

    handleSearch(){
        const from = this.from;
        const to = this.to;
        this.setState({
            to,
            from,
            search: true,
        });
    }

    handleSubmit(){
        this.travel();
    }

    travel = async () => {
        const token = cookies.get('token');
        const variables = { token: token ,from: this.state.from, to: this.state.to  };
        const response = await dataFetch({ query, variables });
        if (!Object.prototype.hasOwnProperty.call(response, 'errors')) {
            console.log('worked');
        }
    };

    render() {
      const MapLoader = withScriptjs(Map);
        console.warn("from", this.from)
        console.warn("to", this.to)
      return (
        <React.Fragment>
          <NavBar />
          <div className="page-container">
              {this.state.search ? <MapLoader
                  googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyCaK8qoLfQ8WW7M4XGe60O1_LpVrBE6yyk"
                  loadingElement={<div style={{ height: `100%` }} />}
                  from={this.state.from}
                  to={this.state.to}
              />: null}
              <div className="row forms page-container">
                   {/* <div className="col-sm-4">
                      <input placeholder="From"
                             ref={(from) => this.from = from}
                      />
                  </div>
                  <div className="col-sm-1"/>
                  <div className="col-sm-4">
                      <input placeholder="To"
                             ref={(to) => this.to = to}
                      />
                  </div>} */}
                  <div className="col-md-2">
                      <button style={{marginLeft: 10}} onClick={this.handleSearch}>Search</button>
                  </div> }

                       <div className="col-sm-4">
                          <GoogleComponent

                              apiKey={API_KEY}
                              language={'en'}
                              country={'country:in'}
                              coordinates={true}
                              locationBoxStyle={'custom-style'}
                              locationListStyle={'custom-style-list'}
                              onChange={(e) => { this.setState({ place: e }) }} 
                              onChange={(e) => { this.from = e.place }}
                                />
                          
                      </div>
                      <div className="col-sm-4">
                          <GoogleComponent

                              apiKey={API_KEY}
                              language={'en'}
                              country={'country:in'}
                              coordinates={true}
                              locationBoxStyle={'custom-style'}
                              locationListStyle={'custom-style-list'}
                              onChange={(e) => { this.setState({ place: e }) }}
                              onChange={(e) => { this.to = e.place }}
                              
                          />
                         
                      </div> 



                  {this.state.search ? <button style={{marginTop: 15 , marginLeft: 20}} onClick={this.handleSubmit}>Confirm</button> : null}
              </div>
          </div>

        </React.Fragment>
    );
  }
}

export default Dashboard;
