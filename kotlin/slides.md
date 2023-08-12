---
title: Foobar
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

# Optionals

## (or null safety)

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
): Map<String, CacheEntry> = requested
    .mapNotNull { storage.getCacheEntry(it.iri, lang) }
    .associateBy { it.iri }
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

# Immutability

First-class citizen

----

## Referential immutability

```kotlin
val foo = "immutable"
var bar = "mutable"

foo = "error" // Val cannot be reassigned
bar = "ok but should you?"
```

----

## Referential immutability

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

---

# IO

First-class citizen

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

Note: Regular values have the same behaviour as blocking IO, flows are cold.

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
