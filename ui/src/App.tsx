import React from 'react';
import './App.css';
import * as api from './typescript-fetch-client';

interface Props { }

interface State {
  isLoading: boolean;
  averages: api.HotelPriceAverageResponse[];
}

class App extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      isLoading: false,
      averages: [],
    }
  }

  onClick = () => {
    this.setState({ isLoading: true, averages: [] });

    const hotelsApi = new api.HotelsApi();
    hotelsApi.averagePricesPerPlan(201907)
      .then(response => {
        this.setState({ averages: response });
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
            {this.state.averages.map((average, index) =>
              <tr key={index}>
                <td>{average.hotelName}</td>
                <td>{average.planName}</td>
                <td>{average.planDetail}</td>
                <td>{average.average.toFixed(4)}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div >
    );
  }
}

export default App;
