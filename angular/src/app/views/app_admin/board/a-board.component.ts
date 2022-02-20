import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../../core/api.service';

@Component({
  selector: 'app-a-board',
  templateUrl: './a-board.component.html',
  styleUrls: ['./a-board.component.scss']
})
export class ABoardComponent implements OnInit {
  constructor(
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private api: ApiService,
  ) { }

  getBoardListData: any = [];
  dtOptions: DataTables.Settings = {};
  ngOnInit(): void {
    this.getBoardList();
  }

  getBoardList() {
    this.dtOptions = {};
    this.getBoardListData = [];

    this.spinner.show();
    this.api.getBoardList().subscribe(
      (response) => {
        if (response.status) {
          this.dtOptions = {
            pagingType: 'full_numbers',
            pageLength: 5,
            lengthMenu: [5, 10, 15, 20],
            processing: true,
            order: []
          };
          this.getBoardListData = response.data;
        }
        else {
          this.toastr.error(response.error, 'API Error');
        }
        this.spinner.hide();
      }
    );
  }

  trackFunction(index: number, element: any) {
    return element ? element.id : null
  }

}
