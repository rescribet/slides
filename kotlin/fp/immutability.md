
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

Deriving data is easy too

```kotlin
val paul = john.copy(name = "Paul")
```

<small>
(Arrow, the Kotlin FP library, contains lenses too)
</small>

----

## Referential immutability

Arguments cannot be reassigned

```kotlin
fun contrived(arg: String) {
    arg = "error" // Val cannot be reassigned
}
```

Note: have seen this in some languages, which is crazy.

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
