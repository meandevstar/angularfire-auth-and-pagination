import { Component, OnInit, ViewEncapsulation, ElementRef, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { StateService, TokenActions } from '../../store';
import { Observable } from 'rxjs/Observable';
import { Token, UserConfig } from '../../models';
import { Subscription } from 'rxjs/Subscription';
import * as _ from 'lodash';



@Component({
  selector: 'app-tokens',
  templateUrl: './tokens.component.html',
  styleUrls: ['./tokens.component.css']
})
export class TokensComponent implements OnInit {

  @ViewChild('tokenTable') tableEl: any;

  private getConfigSuccess$: Observable<boolean>;
  private items: Array<Token>;
  private originalItems: Array<Token>;
  private columns: Array<object>;
  private profile$: Observable<UserConfig>;
  private subscription: Subscription;
  private expanded: any = {};
  private dateRanges: Array<any>;
  private isShowColumnFilters: boolean;
  private descriptionFilter: string;
  private updatedAtFilter: string;
  private pageInfo: any;
  private subscriptions: Array<Subscription>;
  private showPageSpinner: boolean;


  constructor(
    private state: StateService,
    private afs: AngularFirestore
  ) { }

  ngOnInit() {    

    this.items = [];
    this.originalItems = [];
    this.pageInfo = {
      count: 0,
      limit: 8,
      offset: 0,
      order: {
        name: 'id',
        value: 'asc'
      },
      filter: null
    };
    this.showPageSpinner = false;
    

    this.getConfigSuccess$ = this.state.select(s => s.token.getTokenRequestSuccess);
    this.subscriptions = [
      this.state.select(s => s.token.data).subscribe(data => {
        if (data.length >= 0) {
          this.showPageSpinner = false;
          this.items = data;

          setTimeout(() => {
            $('.sort-btn').css('display', 'none');
            $('.datatable-icon-skip').closest('li').css('display', this.pageInfo.filter ? 'inline-block' : 'none');
            $('.datatable-icon-prev').closest('li').css('display', this.pageInfo.filter ? 'inline-block' : 'none');
          }, 100);
        }
      }),

      this.state.select(s => s.token.tokensInfo).subscribe((data: any) => {
        if (data && data.counts) this.pageInfo.count = data.counts;
      })
    ];
    this.profile$ = this.state.select(s => s.user.profile);
    this.state.dispatch(new TokenActions.GetTokenAttempt(
      Object.assign({ needToFetch: true }, this.pageInfo)
    ));
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  updateFilter(field, instantUpdate) {

    try {
      switch (field) {
        case 'description':
          this.pageInfo.filter = {
            name: 'description',
            value: this.descriptionFilter
          }
          break;
        case 'updatedAt':
          this.pageInfo.filter = {
            name: 'updatedAt',
            value: new Date(Date.parse(this.updatedAtFilter)).getTime(),
            maxValue: new Date(Date.parse(this.updatedAtFilter)).getTime() + 24 * 60 * 60 * 1000
          }
          break;
      }
      this.pageInfo.needToFetch = true;

      if (isNaN(this.pageInfo.filter.value) || !this.pageInfo.filter.value ||
        (Object.keys(this.pageInfo.filter).indexOf('maxValue') !== -1 && isNaN(this.pageInfo.filter.maxValue))) {
        this.pageInfo.filter = null;
        this.pageInfo.offset = 0;
      }

      _.debounce(() => {
        this.state.dispatch(new TokenActions.GetTokenAttempt(this.pageInfo));
      }, 1300, instantUpdate)();     

    } catch (e) { }

  }

  /**
   * Populate the table with new data based on the page number
   * @param page The page to select
   */
  setPage(pageInfo) {
    this.showPageSpinner = true;
    this.pageInfo.offset = pageInfo.offset;
    this.state.dispatch(new TokenActions.GetTokenAttempt(this.pageInfo));
  }

  /**
   * Setting up sorting information
   * @param fieldName : Real firestore field name (not column display name)
   */
  sort(fieldName) {
    let newOrder = {
      name: fieldName,
      value: 'asc' 
    };

    this.pageInfo.offset = 0;

    if (this.pageInfo.order && this.pageInfo.order.name === fieldName) {
      if (this.pageInfo.order.value === 'desc') {
        this.pageInfo.order.value = 'asc';
      } else {
        this.pageInfo.order.value = 'desc';
      }
    } else {
      this.pageInfo.order = newOrder;
    }

    this.state.dispatch(new TokenActions.GetTokenAttempt(
      Object.assign({ needToFetch: true }, this.pageInfo))
    );
  }

  clearFilters() {
    this.descriptionFilter = '';
    this.updatedAtFilter = '';
  }

  toggleFilters() {
    this.isShowColumnFilters = !this.isShowColumnFilters;
    this.clearFilters();
  }

  getDateString(timestamp) {
    return timestamp ? new Date(timestamp).toLocaleDateString() : '';
  }

}
