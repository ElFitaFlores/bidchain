import { Component, OnInit } from '@angular/core';
import * as Web3 from 'web3';

import { ABI_DASHBOARD, ADDRESS } from '../constants';

declare let window: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent implements OnInit {

  public bids: Array<any>;
  private web3: any;

  constructor() {
    if (typeof window.web3 !== 'undefined') {
      // Use Mist/MetaMask's provider
      this.web3 = new Web3(window.web3.currentProvider);
    } else {
      console.warn(
        'Please use a dapp browser like mist or MetaMask plugin for chrome'
      );
    }
  }

  async ngOnInit() {
    this.bids = await this.getBids();
    for (let i = 0; i < this.bids.length; i++) {
      setInterval(() => {
        this.bids[i]['left'] = this.calculateDate(this.bids[i].timeLeft);
        this.bids[i].timeLeft--;
      }, 1000);
    }
  }

  calculateDate(seconds: number) {
    let days, hrs, mins, secs;
    if (seconds > -1) {
      days = this.pad(Math.floor(seconds / 86400), 2);
      hrs = this.pad(Math.floor((seconds % 86400) / 3600), 2);
      mins = this.pad(Math.floor(((seconds % 86400) % 3600) / 60), 2);
      secs = this.pad(Math.floor((seconds % 86400) % 3600) % 60, 2);
    }
    if (!days) days = '00';
    if (!hrs) hrs = '00';
    if (!mins) mins = '00';
    if (!secs) secs = '00';
    return days + ':' + hrs + ':' + mins + ':' + secs;
  }

  pad(s, size) {
    //Concatenates a '0' if number size equals 1, ex: '8' to '08'
    s = String(s);
    while (s.length < (size || 2)) { s = "0" + s; }
    return s;
  }

  getBidsCount = async () => {
    const Dashboard = window.web3.eth.contract(ABI_DASHBOARD);
    let dashboardInstance = Dashboard.at(ADDRESS);
    return new Promise((resolve, reject) => {
      dashboardInstance.bidCount((err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data.toString())
        }
      });
    });
  }

  getBids = async () => {
    let count = await this.getBidsCount();
    let addressArray = [];
    for (let i = 0; i < count; i++) {
      let info = await this.getBidInfo(i);
      let array = info.toString().split(",");
      let img = "assets/placeholder2.gif";
      if (array[4]) img = array[4]
      addressArray.push({
        product: array[0],
        value: array[5],
        people: array[6],
        timeLeft: array[1],
        url: img
      });
    }
    return addressArray;
  }

  getBidInfo = async (id) => {
    const Dashboard = window.web3.eth.contract(ABI_DASHBOARD);
    let dashboardInstance = Dashboard.at(ADDRESS);
    return new Promise((resolve, reject) => {
      dashboardInstance.viewCurrentBid(id, (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data.toString())
        }
      });
    });
  }

  makeABid = async (id, amount) => {
    const Dashboard = window.web3.eth.contract(ABI_DASHBOARD);
    let dashboardInstance = Dashboard.at(ADDRESS);
    return new Promise((resolve, reject) => {
      dashboardInstance.makeBid(id, {
        value: amount
      }, (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data.toString())
        }
      });
    });
  }

  async makeBid(id) {
    let element: any = <HTMLInputElement>document.getElementsByClassName('bid-value')[id];
    let response = await this.makeABid(id, element.value);
  }

}
