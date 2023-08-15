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
        .filter { !it.isEmptyOrNotPublic() }
        .associateBy { it.iri }
}
```

Note:
Even though getCacheEntry is suspend, we can still use regular functions like `mapNotNull`.

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
