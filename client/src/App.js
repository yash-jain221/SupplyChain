import React, { Component } from "react";
import ItemManagerContract from "./contracts/ItemManager.json";
import ItemContract from "./contracts/Item.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = { loaded: false , cost:0, ItemName: "example"};

  componentDidMount = async () => {
    try {
      this.web3 = await getWeb3();

      this.accounts = await this.web3.eth.getAccounts();

      this.networkId = await this.web3.eth.net.getId();

      this.ItemManager = new this.web3.eth.Contract(
        ItemManagerContract.abi,
        ItemManagerContract.networks[this.networkId] && ItemManagerContract.networks[this.networkId].address,
      );

      this.Item = new this.web3.eth.Contract(
        ItemContract.abi,
        ItemContract.networks[this.networkId] && ItemContract.networks[this.networkId].address,
      );
      this.listenToPaymentEvent()
      this.setState({ loaded: true });
    } catch (error) {
 
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }

  };

  handleInputChange = (event)=>{
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({
      [name]: value
    })
  }

  listenToPaymentEvent = async ()=>{
    this.ItemManager.events.SupplyChainStep().on("data" , async (event)=>{
      console.log(event);
      let itemObj = await this.ItemManager.methods.items(event.returnValues.index).call();
      alert("item " + itemObj.identifier + " was paid for. deliver it now.");
    })
  }

  handleSubmit = async()=>{
    const {cost,ItemName} = this.state;
    let result = await this.ItemManager.methods.createItem(ItemName,cost).send({from: this.accounts[0]})
    alert("Send " + cost + " wei to " + result.events.SupplyChainStep.returnValues.ItemAddress)
  }

  
  render() {
    if (!this.state.loaded) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Supply Chain</h1>
        <h2>Items</h2>
        <form>
          <label>Item name: </label> 
          <input type="text" name="ItemName" value={this.state.itemName} onChange={this.handleInputChange}></input>
          <label>Cost in wei: </label>
          <input type="number" name="cost" value={this.state.cost} onChange={this.handleInputChange}></input>
          <button type="button" onClick={this.handleSubmit}>Create New Item</button>
        </form>
      </div>
    );
  }
}

export default App;
