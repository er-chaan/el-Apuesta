import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../../core/api.service';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit {

  userObj: any;
  transactionsByIdData: any = [];
  // dtOptions: any = {};
  dtOptions: DataTables.Settings = {};

  constructor(
    private api: ApiService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.userObj = JSON.parse(sessionStorage.getItem("user"));
    this.getTransactionsById();
  }

  getTransactionsById() {
    this.dtOptions = {};
    this.transactionsByIdData = [];

    this.spinner.show();
    this.api.transactionsGetByUid(this.userObj.uid).subscribe(
      (response) => {
        if (response.status) {
          this.dtOptions = {
            pagingType: 'full_numbers',
            pageLength: 5,
            lengthMenu: [5, 10, 15, 20],
            processing: true,
            order: []
          };
          this.transactionsByIdData = response.data;
        }
        else {
          this.toastr.error(response.error, 'API Error');
        }
        this.spinner.hide();
      },
      (error) => {
        this.spinner.hide();
      },
    )
  }

}
