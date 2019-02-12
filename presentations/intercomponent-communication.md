# Intercomponent communication

Note: Next slide is Input/Output, so introduce with "How components communicate between eachothers, using the usual suspects: *click*"

---

- `@Input()` 
- `@Output()`
- `Services`

Note: The basics. Most of you will be familiar with these.

---

### Smart vs. Dumb Components

- Controller  vs. Presentation Components<!-- .element: class="fragment" -->
- Logic vs. Pure Components<!-- .element: class="fragment" -->
- Smart vs. Simple Components<!-- .element: class="fragment" -->

Note: Intercomponent communication is used a lot when you are trying to split "presentational" only components, from components that act as controllers, or in any way enforce business logic. You will need to feed the simple component with data, and any events that happen need to bubble back up. We will use this premise throughout this presentation, as to spark your imagination of where you would run into this.

---

### What's wrong with `@Input()` and `@Output()`?

Note: Well, nothing wrong there. But there may be cases where you want it a bit differently. Especially `@Output()` has its limitations. We'll get to that.

---

### Services may not be great for Simple Components

- They could tightly couple your Simple Component.<!-- .element: class="fragment" -->

Note: Services can be made quite specific for a Simple Component; but you will have to provide it in its parent component to work, or have a tightly coupled parent service be used in the Simple Component. Both can feel off and not quite fit the solution you were going for.

---

### The main issue with `@Output()`

```
<app-child (thing)="handle($event)"></app-child>
```
<!-- .element: class="fragment" -->

```
handle(e: EventType) {
    // do things with the events.
}   
```
<!-- .element: class="fragment" -->

Note: You need to bind its handle to a function. Sometimes, you just want an Observable stream of its events, but you can't have that here unless you decide to put it on a self-managed Subject here.

---

### An alternative way

```
@Component({ ... })
export class ParentComponent  {
    childEvents: EventEmitter<EventType> = new EventEmitter<EventType>()
    // Has to be public, else the strict compiler will dislike you! ;-)
}
```
<!-- .element: class="fragment" -->

```
<app-child (thing)="childEvents.emit($event)"></app-child>
```
<!-- .element: class="fragment" -->

```
ngOnInit() {
    this.childEvents.asObservable()
    .pipe(
        filter(),
        map(),
        takeUntil()
    ).subscribe()
}
```
<!-- .element: class="fragment" -->

You get the power of Rx! ✅<!-- .element: class="fragment" -->

Note: Pros, @Output() is still "simple" enough, nothing special on the child component. Cons, you will need an EventEmitter or Subject inside your parent component to expose its methods.

---

### Yet another alternative way

```
<app-child #child></app-child>
```
<!-- .element: class="fragment" -->

```
@Component({ ... })
export class ParentComponent {
    @ViewChild(ChildComponent) childComponent: ChildComponent // #1
    @ViewChild('child') childComponent: ChildComponent // #2
}
```
<!-- .element: class="fragment" -->

```
ngOnInit() {
    this.childComponent.thing.asObservable()
    .pipe(
        filter(),
        map(),
        takeUntil()
    ).subscribe()
}
```
<!-- .element: class="fragment" -->

The power of Rx! ✅<!-- .element: class="fragment" -->


Note: Pros, still no changes on the simple component, output functions as expected. Your HTML is less cluttered, there's no internal (additional!) Subjects or EventEmitters that expose their API. Cons; the HTML is less "readable" and not as explicit. One might read this and think; there's no output? It's intention isn't clearly and explicitly defined. You directly expose the EventEmitter (Subject) from the ChildComponent, which would seem like bad practice to me.

---

### Well, we can fix that downside.

```
@Component({ ... })
export class ChildComponent {
    @Output() thing: EventEmitter<any> = new EventEmitter<any>()

    getThing() {
        return this.thing.asObservable()
    }
}
```
<!-- .element: class="fragment" -->

```
ngOnInit() {
    this.childComponent.getThing()
    .pipe(
        filter(),
        map(),
        takeUntil()
    ).subscribe()
}
```
<!-- .element: class="fragment" -->

Note: Pros, not necessarily exposing the raw EventEmitter or Subject, @Output() still is used and works as expected in any case. Still only 1 EventEmitter in play, instead of 2 for this one example. Readability may still be an issue.

---

# Conclusion

- @Input / @Output are excellent solutions.<!-- .element: class="fragment" -->
- Services are fine, but be conscious about your dependencies.<!-- .element: class="fragment" -->
- In case you want to use the power of RxJS, you may have to look for alternatives.<!-- .element: class="fragment" -->
- There's multiple ways to achieve what you want, but they all have their downsides and might feel a bit cheaty.<!-- .element: class="fragment" -->

---

# Thank you!
### Any questions?