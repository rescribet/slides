---
title: FP in Kotlin
#separator: <!--s-->
#verticalSeparator: <!--v-->
theme: solarized
revealOptions:
  transition: 'none'
---

# Kotlin

<h2>
    The <span style="color: #e28437">Fun</span>ctional Parts
</h2>

<br />
<br />
<br />

Thom van Kalkeren

---

# Kotlin
Misconceptions

----

## Kotlin is not

- A functional language
- An OOP language
- A JVM language
- A language for Android
- Difficult to learn

----

## Kotlin is

- A multi-paradigm language
- A multi-platform language
- Non-dogmatic and Pragmatic
- Trivial to add in existing projects
- Steadily evolving
- <span style="color: #e28437">Fun</span>!

Note:
    Kotlin is a multi-paradigm language. It supports both object-oriented and functional programming.
    Kotlin is a standalone language. It is not a JVM language, it is not a language for Android.
    Kotlin is a language with multiple targets. It can be compiled to JVM bytecode, WASM, JavaScript, and native code.
    Kotlin Native compiles to iOS, macOS, Android, Windows, and Linux. 
    Kotlin is fun. It is easy to learn and use.

---

<h1>
    <span style="color: #e28437">Fun</span>ctions
</h1>

First-class citizen

----

## First-class citizen

```kotlin
// Top level
fun add(a: Int, b: Int): Int {
    return a + b
}

// Single expression inlining
fun add(a: Int, b: Int): Int = a + b

// Lambda
val add: (Int, Int) -> Int = { a, b -> a + b }

// Reference
val add: (Int, Int) -> Int = Int::plus

// Extension `1.add(2)`
fun Int.add(b: Int): Int = this + b
```

----

## First-class citizen

Higher-order functions

```kotlin
inline fun <T> List<T>.filter(pred: (T) -> Boolean): List<T>
```

```kotlin
val numbers = listOf(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)
    .filter { it % 2 == 0 }
    .reduce(Int::plus)
// -> 30
```

Note:
    If the last argument is a lambda, it can be moved out of the parentheses.
    it: implicit name of a single parameter
    Lambdas have implicit return.
    Has access to its closure.

----

## Scope functions
```kotlin
inline fun <T, R> T.let(block: (T) -> R): R
```

```kotlin
Person("Alice", 20, "Amsterdam").let {
    println(it)
    it.moveTo("London")
    it.incrementAge()
    println(it)
}
```

Note: `let` can be used to invoke one or more functions on results of call chains.

----

## Scope functions
```kotlin
inline fun <T> T.also(block: (T) -> Unit): T
```

```kotlin
val numbers = mutableListOf("one", "two", "three")
numbers
    .also { println("The list elements before adding new one: $it") }
    .add("four")
```

Note: Also is useful for performing some actions that take the context object as an argument.

----

## Extension functions
```kotlin
inline fun <T> T.takeIf(predicate: (T) -> Boolean): T?
inline fun <T> T.takeUnless(predicate: (T) -> Boolean): T?
```

```kotlin
val number = Random.nextInt(100)

val evenOrNull = number.takeIf { it % 2 == 0 }
val oddOrNull = number.takeUnless { it % 2 == 0 }

println("even: $evenOrNull, odd: $oddOrNull")
// -> even: null, odd: 47
```

----

## Recursive functions

Tail call optimization can be enforced by the compiler

```kotlin
tailrec fun factorial(n: Int, result: Int = 1): Int {
    return if (n == 1) result else factorial(n - 1, n * result)
}
```

Note: Also is useful for performing some actions that take the context object as an argument.

---

# Immutability

First-class citizen

----

## Referential immutability

Mutability is opt-in

```kotlin
val foo = "immutable"
var bar = "mutable"

foo = "error" // Val cannot be reassigned
bar = "ok but should you?"
```

----

## Referential immutability

Creating deeply immutable structures is easy

```kotlin
data class User(
    val name: String,
    val age: Int,
) {
    val isAdult: Boolean
        get() = age >= 18
}
```

----

## Referential immutability

Arguments cannot be reassigned

```kotlin
fun contrived(arg: String) {
    arg = "error" // Val cannot be reassigned
}
```

----

## Value immutability

> Strings are immutable. Once you initialize a string, you can't change its value or assign a new value to it.
>
> -- <cite>Kotlin docs</cite>

`Number`, `Boolean`, `String`, `Unit`

----

## Value immutability

|                                                                                |                                                      |
|--------------------------------------------------------------------------------|------------------------------------------------------|
| <div style="white-space: nowrap">😽Immutable<span class="super">1</span></div> | `PersistentCollection`, `PersistentMap`              |
| ✅️ Read only                                                                   | `Iterable`, `Collection`, `Map`                      |
| 🙈️ Mutable                                                                    | `MutableIterable`, `MutableCollection`, `MutableMap` |

<small class="left">
    1: Needs `kotlinx.collections.immutable`
</small>

Note:
Read-only throws UnsupportedOperationException but underlying structure is not guaranteed.
Immutable is still alpha.

----

## Hierarchical immutability

Classes and methods are final by default

```kotlin
open class Base {
    // Overridable
    open fun foo() = "foo"
    
    // Not overridable
    fun bar() = "bar"
}

class Derived : Base() {
    override fun foo() = "derived foo"
    
    // Compilation error
    override fun bar() = "derived bar"
}
```

---

# Optionals

First-class citizen

----

## Part of the type system

Optionals are not a special case

```kotlin[1-3|5]
fun findAll(): List<User>

fun findByName(): User?

fun T?.orDefault(default: T): T = this ?: default
```

Note:
    Non-optional or optional (nullable)
    Null can be a receiver like other types

----

## Part of the type system

```kotlin [1-4|8-9|10-11]
data class User(
    val name: String,
    val address: Address?,
)

fun contrived() {
    println(user.name)
    // Compilation error
    println(user.address.street)
    // Valid
    println(user.address?.street ?: "unknown")
}
```

----

## Part of the standard library

```kotlin
fun String?.orEmpty(): String = this ?: ""

fun <T, R : Any> List<T>.mapNotNull(func: (T) -> R?): List<R>
```

----

## Part of the standard library

```kotlin
fun readFromStorage(
    requested: List<CacheRequest>,
): Map<String, CacheEntry> {
    return requested
        .mapNotNull { storage.getCacheEntry(it.iri, lang) }
        .associateBy { it.iri }
}
```

----

## Part of idiomatic Kotlin

```kotlin [4-8]
fun Configuration.proxiedUri(
    original: ApplicationRequest,
    call: ApplicationCall
): String = transformsMap
    .entries
    .find { (path) -> path.containsMatchIn(original.uri) }
    ?.let { (_, transform) -> transform(call.request) }
    ?: original.uri
```

Note:
    Get the map entries
    Look for a match
    Apply the transform if find does not return null
    If either find or let return null, fall back with the elvis operator

---

# IO

First-class citizen

Note: `interface Continuation<in T>`

----

# IO

Blocking

```kotlin
class UserRepository {
    fun findByName(name: String): User? = null
    fun findAll(): List<User> = emptyList()
}
```

----

# IO

Non-blocking

```kotlin
class UserRepository {
    suspend fun findByName(name: String): User? = null
    suspend fun findAll(): Flow<User> = emptyFlow()
}
```

Note: Regular values have the same behaviour as blocking IO.

----

# IO

Interaction

![plain.png](assets%2Fplain.png)
![suspend.png](assets%2Fsuspend.png)

----

# IO

Granularity

```kotlin
val serverJob = launch(Dispatchers.IO) {
    for (received in serverSession.incoming) {
        clientSession.send(received) // blocking
    }
}

val clientJob = launch(Dispatchers.IO) {
    for (received in clientSession.incoming) {
        serverSession.send(received) // blocking
    }
}

joinAll(serverJob, clientJob)
```

Note:
    Structured concurrency ensures no leaks

----

# IO

Cooperative cancellation

```kotlin
val serverJob = launch(Dispatchers.IO) {
    for (received in serverSession.incoming) {
        clientSession.send(received) // blocking
        yield() // Allow cancellation
    }
}

val checkJob = launch(Dispatchers.IO) {
    if (!contrivedService().checkEnabled()) {
        serverJob.cancel()
    }
}

joinAll(serverJob, checkJob)
```

----

# IO

Pitfalls

```kotlin
fun main() {
    println("foo")
}
```

Note:
    Not enforced for all I/O
    I.e. println performs blocking IO, yet is not suspend.

---

# Reactive Streams

First-class citizen

----

# Flow
- As simple as possible
- Built on top of coroutines
- Cold
- Extensible
- Reactive, Reactor & RxJava interop

Note:
    Cold: Only starts emitting values when a collector is attached
    Coroutines: cooperative cancellation and structured concurrency

----

# Flow
KISS

```kotlin
interface Flow<out T> {
    suspend fun collect(collector: FlowCollector<T>)
}

fun interface FlowCollector<in T> {
    suspend fun emit(value: T)
}
```

----

# Flow
You use the same interface as the core team

```kotlin
fun <T> (() -> T).asFlow(): Flow<T>
fun <T, R> Flow<T>.map(tf: (value: T) -> R): Flow<R>
fun <T> Flow<T>.filter(pred: (T) -> Boolean): Flow<T>
fun <T: Any> Flow<T?>.filterNotNull(): Flow<T>
fun <S, T : S> Flow<T>.reduce(op: (acc: S, v: T) -> S): S
fun <T> Iterable<Flow<T>>.merge(): Flow<T>
fun <T> Flow<T>.debounce(timeoutMillis: Long): Flow<T>
fun <T> Flow<T>.withIndex(): Flow<IndexedValue<T>>
fun <T> Flow<T>.distinctUntilChanged(): Flow<T>
```

Note: These are not the actual signatures, but they are close enough.

----

# Flow
CallbackFlow

```kotlin
fun flowFrom(api: ChatApi): Flow<T> = callbackFlow {
    val callback = object : ChatListener {
        override fun onMessage(value: String) {
            send(value)
        }
        
        override fun onCompleted() = channel.close()
    }
    api.register(callback)

    awaitClose { api.unregister(callback) }
}
```
