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
