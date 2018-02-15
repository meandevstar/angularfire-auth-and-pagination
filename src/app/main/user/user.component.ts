import { Component, OnInit, ViewEncapsulation, OnDestroy, ViewChild } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { StateService, ConfigActions } from '../../store';
import { Observable } from 'rxjs/Observable';
import { UserConfig } from '../../models';
import { Subscription } from 'rxjs/Subscription';
import * as firebase from 'firebase';
import * as _ from 'lodash';


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class UserComponent implements OnInit {

  private getConfigSuccess$: Observable<boolean>;
  private originalItems: Array<any>;
  private items: Array<any>;
  private columns: Array<object>;
  private userTypes: Array<object>;
  private profile$: Observable<UserConfig>;
  private subscription: Subscription;
  private isShowColumnFilters: boolean;
  private nameFilter: string;
  private emailFilter: string;
  private typeFilter: string;
  private dateRanges: Array<any>;
  private dateFilter: number;

  constructor(
    private state: StateService,
    private afs: AngularFirestore
  ) { }

  ngOnInit() {

    this.originalItems = [];
    this.items = [];
    this.columns = [
      { name: 'Name' },
      { name: 'Email' },
      { name: 'Status' },
      { name: 'Type' }
    ];
    this.userTypes = [
      {
        title: 'Super Admin',
        value: 'SUPER_ADMIN'
      },
      {
        title: 'Admin',
        value: 'ADMIN'
      },
      {
        title: 'User',
        value: 'USER'
      }
    ];

    // Setting date ranges
    const today = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(today.getMonth() - 1);

    this.dateRanges = [
      {
        title: 'All',
        value: 0
      },
      {
        title: 'A day ago',
        value: 24 * 60 * 60 * 1000
      },
      {
        title: 'A week ago',
        value: 7 * 24 * 60 * 60 * 1000
      },
      {
        title: 'A month ago',
        value: today.getTime() - oneMonthAgo.getTime()
      }
    ];
    this.dateFilter = this.dateRanges[0].value;    
    this.getConfigSuccess$ = this.state.select(s => s.config.getConfigRequestSuccess);
    let subscription = this.state.select(s => s.config.data).subscribe(data => {
      if (data.length) {
        this.originalItems = data.map(v => Object.assign(v, {name: `${v.firstName} ${v.lastName}`}))
        this.updateFilter();
        setTimeout(() => {
          $('.pager li>a').css('background-color', '#424242');
          $('.pager li>a').css('border', 'none');
          $('.sort-btn').css('display', 'none');
        }, 100);
      }
    });
    this.profile$ = this.state.select(s => s.user.profile);

    this.state.dispatch(new ConfigActions.GetUserConfigAttempt());

    this.clearFilters();
  }

  ngOnDestroy() {
    if (this.subscription) this.subscription.unsubscribe();
  }

  updateUser(user: UserConfig) {
    const payload = _.omit(user, ['name']);
    // this.state.dispatch(new ConfigActions.UpdateUserAttempt(payload));
  }

  approveUser(user: UserConfig) {
    let payload = _.omit(user, ['name']);
    payload.status = 'APPROVED';
    this.state.dispatch(new ConfigActions.UpdateUserAttempt(payload));
  }

  updateFilter() {
    this.items = this.originalItems.filter(v => 
      (this.nameFilter === '' || v.name.indexOf(this.nameFilter) !== -1) &&
      (this.emailFilter === '' || v.email.indexOf(this.emailFilter) !== -1) &&
      (this.typeFilter === '' || v.type.toLowerCase().indexOf(this.typeFilter.toLowerCase()) !== -1)
    )
  }

  clearFilters() {
    this.nameFilter = '';
    this.emailFilter = '';
    this.typeFilter = '';
    this.items = this.originalItems;
  }

  toggleFilters() {
    this.isShowColumnFilters = !this.isShowColumnFilters;
    this.clearFilters();
  }

  isSuperAdmin(type) {
    return this.profile$.map(data => data && data.type === 'SUPER_ADMIN');
  }

  getString(str) {
    str = str.toLowerCase();
    return str.charAt(0).toUpperCase() + str.slice(1);
  }  
}
