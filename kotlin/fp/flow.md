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
