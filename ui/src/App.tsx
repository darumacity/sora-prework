import React from 'react';
import './App.css';
import * as api from './typescript-fetch-client';

interface Props { }

interface State {
  isLoading: boolean;
  hotelAverages: api.HotelPriceAverageResponse[];
}

class App extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      isLoading: false,
      hotelAverages: [],
    }
  }

  onClick = () => {
    this.setState({ isLoading: true, hotelAverages: [] });

    const hotelsApi = new api.HotelsApi();
    hotelsApi.averagePrices(201907)
      .then(response => {
        this.setState({ hotelAverages: response });
      })
      .finally(() => {
        this.setState({ isLoading: false });
      });
  }

  render() {
    return (
      <div className="App">
        <button onClick={this.onClick}>test</button>
        <div>{this.state.isLoading && 'loading'}</div>
        <table>
          <tbody>
            {this.state.hotelAverages.map((hotelAverage, index) =>
              <tr key={index}><td>{hotelAverage.hotelName}</td><td>{hotelAverage.average.toFixed(4)}</td></tr>
            )}
          </tbody>
        </table>
      </div >
    );
  }
}

export default App;
