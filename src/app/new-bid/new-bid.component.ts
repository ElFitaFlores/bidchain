import { Component, OnInit } from '@angular/core';
import * as Web3 from 'web3';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';

import { ABI_DASHBOARD, ADDRESS } from '../constants';

declare let window: any;

@Component({
  selector: 'app-new-bid',
  templateUrl: './new-bid.component.html',
  styleUrls: ['./new-bid.component.sass']
})
export class NewBidComponent implements OnInit {

  private web3: any;
  public form: FormGroup;

  constructor(private fb: FormBuilder) {
    if (typeof window.web3 !== 'undefined') {
      // Use Mist/MetaMask's provider
      this.web3 = new Web3(window.web3.currentProvider);
    } else {
      console.warn(
        'Please use a dapp browser like mist or MetaMask plugin for chrome'
      );
    }

    this.form = this.fb.group({
      name: ['', Validators.required],
      duration: [0, Validators.required],
      beneficiary: ['', Validators.required],
      description: ['', Validators.required],
      url: [''],
    });
  }

  ngOnInit() {

  }

  async save() {
    let seconds = this.form.controls['duration'].value * 3600 * 24;
    let response = await this.newBid(
      this.form.controls['name'].value,
      seconds,
      this.form.controls['beneficiary'].value,
      this.form.controls['description'].value,
      this.form.controls['url'].value,
    );
  }

  newBid = async (name, duration, beneficiary, description, url) => {
    const Dashboard = window.web3.eth.contract(ABI_DASHBOARD);
    let dashboardInstance = Dashboard.at(ADDRESS);
    return new Promise((resolve, reject) => {
      dashboardInstance.newBid(name, duration, beneficiary, description, url, (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data.toString())
        }
      });
    });
  }

}
