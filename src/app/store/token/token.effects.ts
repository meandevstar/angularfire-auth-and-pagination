
import { Injectable } from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';
import { Router } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection, DocumentChangeAction } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth'
import { Observable } from 'rxjs/Rx';
import { Effect } from '@ngrx/effects';

import { TokenActions } from './token.actions';
import { StateService } from '../state-service/state.service';
import { Token } from 'app/models';
import { Subscription } from 'rxjs/Subscription';
import { subscribeOn } from 'rxjs/operator/subscribeOn';

@Injectable()
export class TokenEffects {

    private docCache: any;
    private resetDoc: any;

    @Effect()
    getTokens$ = this.state.actions$.ofType(TokenActions.GET_TOKEN_ATTEMPT)
        .switchMap((action: TokenActions.GetTokenAttempt) => {
            const currentUserType = this.state.getState().user.profile.type;
            let tokensInfo: any = {
                counts: 0
            };

            if (currentUserType !== 'USER') {

                const pageInfo: any = action.payload;
                let tokensInfo: any = {
                    counts: 0
                };
                const needToFetch = 
                    (this.docCache.token.length <= pageInfo.limit * (pageInfo.offset + 1) && pageInfo.offset % 5 === 0)
                    || pageInfo.needToFetch;

                if (!needToFetch) {
                    const data = this.getPageData(pageInfo, 'token');
                    return Observable.of(
                        new TokenActions.GetTokenSuccess({ data })
                    );
                } else {
                    this.resetDoc.token = pageInfo.needToFetch && (pageInfo.filter || !this.resetDoc.token);
                    const subscription = this.afs.collection(
                        'tokens',
                        ref => this.getPaginateQuery(ref, pageInfo, 'token')
                    ).snapshotChanges();



                    return subscription.map(res => 
                        new Promise(resolve => {
                            this.afs.doc('tableInfo/tokens').ref.get()
                                .then(tokenInfoResult => {
                                    tokensInfo = tokenInfoResult.data();

                                    if (pageInfo.needToFetch) {
                                        this.docCache.token = res;
                                        if (this.resetDoc.token) tokensInfo.counts = res.length;
                                    } else {
                                        this.docCache.token = this.docCache.token.concat(res);
                                    }
                                    resolve();
                                }); 
                        })
                    )
                    .map((promise: any) => {
                        promise.then(() => {
                            // reset cache when order changed
                            this.state.dispatch(
                                new TokenActions.GetTokenSuccess(
                                    { tokensInfo, data: this.getPageData(pageInfo, 'token') }
                                )
                            );
                        })
                        return new TokenActions.GetTokenSuccess({ tokensInfo, data: [] });
                    })
                    .catch(error => Observable.of(new TokenActions.GetTokenFailure()))
                }

            } else {
                return Observable.of(new TokenActions.GetTokenFailure());
            }
        });

    private getPaginateQuery = (ref, pageInfo, type) => {
        let query: any = ref;

        if (pageInfo) {
            if (pageInfo.filter) {
                if (pageInfo.filter.maxValue) {
                    query = query.where(pageInfo.filter.name , '>', pageInfo.filter.value)
                                 .where(pageInfo.filter.name , '<=', pageInfo.filter.maxValue);
                } else {
                    query = query.where(pageInfo.filter.name , '==', pageInfo.filter.value);
                }
            } else {
                if (pageInfo.order) {
                    query = query.orderBy(pageInfo.order.name, pageInfo.order.value);
                }
                if (this.docCache[type].length) {
                    query = query.startAfter(this.docCache[type][this.docCache[type].length - 1].payload.doc);
                }
            }
        }

        return query.limit(pageInfo.limit * 5)
    }

    private getPageData = (pageInfo, type) => {
        const startIndex = pageInfo.limit * pageInfo.offset;
        const endIndex = pageInfo.limit * pageInfo.offset + pageInfo.limit
        const temp = this.docCache[type].slice(startIndex, endIndex);
        return temp.map(data => data.payload.doc.data());
    }



    constructor(
        private state: StateService,
        private afs: AngularFirestore,
        private router: Router,
        private http: Http
    ) {
        this.docCache = {
            token: []
        };
        this.resetDoc = {
            token: false
        }
    }
}