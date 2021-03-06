import { Component, OnInit, OnDestroy } from '@angular/core';
import { navItems, navItemsAdmin, navItemsUser } from '../../_nav';
import { SocialAuthService } from "angularx-social-login";
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-spinner";
import { ApiService } from '../../core/api.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  styles: [
    `
    .xxx {
      display:none
    }
    
    `
  ]
})
export class DefaultLayoutComponent implements OnInit, OnDestroy {
  public sidebarMinimized = false;
  public navItems = navItems;
  public navItemsAdmin = navItemsAdmin;
  public navItemsUser = navItemsUser;
  public now: Date = new Date();

  userObj: any;
  triggerNotifications: Subscription;
  constructor(
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private api: ApiService,
    private router: Router,
    private authService: SocialAuthService) {
    // console.log("constructor");
  }

  s1: any;
  s2: any;
  ngOnInit() {
    // console.log("onInit");
    this.userObj = JSON.parse(sessionStorage.getItem("user"));
    if (this.userObj.email == "er.chandreshbhai@gmail.com") {
      this.navItems = navItemsAdmin
    } else {
      this.navItems = navItemsUser
    }
    // this.navItems = navItems;
    this.s1 = setInterval(() => {
      this.now = new Date();
    }, 1);
    this.s2 = setInterval(() => {
      if (sessionStorage.getItem("user")) {
        this.getNotifications();
      }
    }, 20000);
  }

  ngOnDestroy() {
    // console.log("onDestroy");
    if (this.triggerNotifications) {
      this.triggerNotifications.unsubscribe();
    }
    if (this.s1) {
      clearInterval(this.s1);
    }
    if (this.s2) {
      clearInterval(this.s2);
    }
  }

  toggleMinimize(e) {
    this.sidebarMinimized = e;
  }

  signOut(): void {
    // this.authService.signOut().then(()=>{
    // sessionStorage.clear();
    // this.router.navigate(["/landing"]);
    // });
    this.api.logout().subscribe(
      (response) => {
        if (response.status) {
          // this.triggerNotifications.unsubscribe();
          sessionStorage.clear();
          this.router.navigate(["/landing"]);
          // this.authService.signOut();
        }
        else {
          this.toastr.error(response.error, 'API Error');
        }
        this.spinner.hide();
      },
      (error) => {
        this.toastr.error('API Error');
        this.spinner.hide();
      },
    )
  }

  notificationsData: any = [];
  getNotifications() {
    this.triggerNotifications = this.api.notificationsGet().subscribe(
      (response) => {
        if (response.status) {
          this.notificationsData = response.data;
        }
      }
    )
  }


}
