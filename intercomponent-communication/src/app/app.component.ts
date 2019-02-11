import { Component, OnChanges, OnInit, SimpleChanges, AfterViewInit, EventEmitter, ViewChild } from '@angular/core'
import { Observable, Subject } from 'rxjs'
import { ChildComponent } from './child/child.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'intercmp-comms'
  thingObs1: Observable<any>

  internalSubject: Subject<any> = new Subject<any>()
  internalEventEmitter: EventEmitter<any> = new EventEmitter<any>()
  @ViewChild('view') viewChild: ChildComponent

  // Ignore the bad practice of not unsubscribing.
  ngOnInit() {
    // Must be null-checked to prevent runtime errors.
    if (this.thingObs1) {
      this.thingObs1.subscribe(
        a => { console.log('obs1', a )} // Doesn't work
      )
    }

    this.internalSubject.asObservable().subscribe(
      a => { console.log('internal subject', a)} // Works!
    )
    this.internalEventEmitter.asObservable().subscribe(
      a => { console.log('internal eventEmitter', a)} // Also works!
    )

    this.viewChild.thing.asObservable().subscribe(
      a => { console.log('viewChild subscription', a)} // Works!
    )

    this.viewChild.getThing().subscribe(
      a => { console.log('getThing through ViewChild subscription', a)} // Works too!
    )
  }

  handle(e: any) {
    console.log('internal function', e) // Of course works, this is the default.
  }


}
