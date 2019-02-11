import { Component, OnInit, Output, EventEmitter } from '@angular/core'
import { interval } from 'rxjs'
import { tap } from 'rxjs/operators'

@Component({
  selector: 'app-child',
  templateUrl: './child.component.html',
  styleUrls: ['./child.component.scss']
})
export class ChildComponent implements OnInit {

  @Output() thing: EventEmitter<any> = new EventEmitter<any>()
  delay: number
  constructor() {
    // this.delay = Math.round(Math.random() * 5000) + 1000
    this.delay = 5000
  }

  ngOnInit() {
    this.thing.emit('delay: ' + this.delay)
    interval(this.delay).pipe(
      tap(v => {
        this.thing.emit(v)
      })
    ).subscribe()
  }

}
