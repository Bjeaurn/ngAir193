export class Thing {
  constructor(id: string, name: string, type: string, parentId: string, children: Thing[]) {}
}

// Pros:
const t1 = new Thing() // Perfect type completion, tells you exactly what it wants

// Cons
/*
Let's say we don't want this to be a linked list anymore keeping track of both
it's children and it's parent, so we change its function
*/
export class NewThing { // changed name cause we're in the same file ;-)
  constructor(id: string, name: string, type: string, parentId: string) {}
}

/* Now every implementation of `Thing` has a compile error.
If you are using it in some testdata anywhere, you may not even see these errors directly.
*/

// A more realistic example
export class Transaction {
  constructor(id: number,
    fromAccount: string,
    toAccount: string,
    amount: number,
    currency: string,
    date: Date,
    status: number) {}
}

// Can you already feel the pain?

/*
 What if the front-end were to create a new Transaction for processing by the backend,
 and of you would want the backend to assign a new ID to it.

 What would that look like in the above model?
*/

export class Transaction2 {
  constructor(fromAccount: string, id?: number) {}
  // Remember, optionals have to go at the end of an object...
  // Consider the effect this has if it is decided later that a value (ID) can be optional.
}

export class Transaction3 {
  constructor(id: number | null) {}
}

export class Transaction4 {
  constructor(id: number = -1, fromAccount: string) {}
}

// Another thing to take into consideration is Front-end / Back-end communication.
// Data from the BE as JSON can be turned into an actual class.
export interface HttpClient { get<T>(url): any}

export interface TransactionJson {
  id: number,
  fromAccount: string,
  toAccount: string,
  amount: number,
  currency: string,
  date: Date,
  status: number
}

export function jsonToTransactions(json: TransactionJson) {
  return new Transaction(
    json.id,
    json.fromAccount,
    json.toAccount,
    json.amount,
    json.currency,
    json.date,
    json.status
  )
  // I don't like this overhead honestly, and the Transaction class does not contain business logic.
  // So I'd say this is a waste of time and makes it very unmanageable.
}

export class TransactionService1 {
  constructor(private http: HttpClient) {}

  getTransactionsByAccountId(accountId: string) {
    return this.http.get<Transaction[]>('url').pipe(
      map(jsonToTransactions) // Simple enough?
    )
  }
}

// Or you can have an `interface` instead of a class.
export interface Transaction {
  id: number,
  fromAccount: string,
  toAccount: string,
  amount: number,
  currency: string,
  date: Date,
  status: number
}


export class TransactionService2 {
  constructor(private http: HttpClient) {}

  getTransactionsByAccountId(accountId: string) {
    const url = 'url/:accountId'.replace(':accountId', accountId)
    return this.http.get<Transaction[]>(url)
  }
}

// -- Alright, so consider the following case: --
/*
- Transactions mainly live in the backend, you just want to represent them in the FE.
- New transactions follow a specific pattern, that are to be generated from the FE.
- A transaction is actually made up of elements that you see everywhere in the domain.
*/

// Here we go, "how I would (try to) do it"

export interface Transaction {
  id: number // UUID? number? doesn't really matter. We'll get to that.
  accounts: { from: Account, to: Account },
  details: TransactionDetails,
  date: Date,
  status: number // 0, 1, 2 ? 
}

export interface TransactionDetails {
  amount: number
  currency: string
}

export interface Account {
  user: string,
  accountNumber: string
}



