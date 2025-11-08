---
title: "Embracing Functional Programming in Python"
date: "2023-07-23"
path: "/functional_python"
desc: "Python is a multi-paradigm programming language, which proves to be a great place for begineers to start learning about functional programming"
---

## Introduction

In the ever-evolving world of programming, different paradigms have emerged, each with its own philosophies and approaches to solving problems. One such paradigm that has stood the test of time is Functional Programming (FP). With its roots in mathematical function theory, functional programming offers a different perspective and a set of tools to tackle programming challenges, aiding in writing more predictable and maintainable code.

In this article, we'll dive into the world of functional programming, specifically in the context of Python. While Python is often associated with the Object-Oriented Programming (OOP) paradigm, it also offers powerful support for the functional programming paradigm. We'll discover how to embrace functional programming in Python, discussing its strengths, reviewing key concepts, and understanding how Python enables us to write functional code.

## What is Functional Programming?

Functional Programming (FP) is a programming paradigm that treats computation as the evaluation of mathematical functions and avoids changing state and mutable data. This definition might sound complex, but we can break it down into simpler terms.

In FP, functions are first-class entities. This means that, like any other entity, a function can be passed as an argument, returned from a function, and assigned to variables. The core philosophy of functional programming is to abstract control flows and operations on data with functions, leading to code that is easy to understand, test, and debug.

The concept of "pure functions" lies at the heart of functional programming. A pure function is one that given the same input, will always produce the same output, and it does not have any observable side effects. This makes your program more predictable and easier to debug, since you can isolate functions and reason about their behavior independently.

Functional programming also stresses on immutability. In FP, once a variable is set, it cannot be changed. Instead of modifying variables, functional programming usually uses functions to derive new values from existing ones. This aspect further strengthens the predictability and simplicity of code.

### Benefits of Functional Programming

1. **Predictability**: Since functional programs have no side effects, given the same input, a function will always produce the same output.

2. **Concurrency**: Due to the absence of mutable state and data in functional programming, it's easier to write programs that can execute concurrently or in parallel.

3. **Modularity and Composability**: Functional programs are modular and composed of small, testable functions. This makes the code easier to understand, write, and test.

### Challenges of Functional Programming

1. **Learning Curve**: For developers accustomed to imperative programming paradigms, functional programming requires a shift in mindset, and it may take time to become proficient.

2. **Performance**: Functional programming, by favoring immutability and recursion, can lead to performance overhead in some scenarios. However, this is often mitigated by smart compiler or interpreter optimizations.

3. **Debugging**: Although functional programs are easier to test and reason about, they can be challenging to debug, especially when dealing with recursion or lazy evaluation.

Remember, the goal is not to completely switch from your current paradigm to functional programming. Instead, it's about understanding the strengths and use-cases of functional programming, and using them as another tool in your programming tool belt.

## Functional Programming and Python

While Python is a multi-paradigm language that primarily supports procedural and object-oriented programming, it also incorporates functional programming features. These features allow developers to utilize the power and expressiveness of functional programming when it suits their needs.

#### Immutability in Python

In Python, some data types are mutable, such as lists and dictionaries, while others like tuples and strings are immutable. When we say that an object is immutable, it means that its state cannot be modified after it's created.

Let's consider an example:

```python
# Tuple (Immutable)
t = (1, 2, 3)
# This will raise a TypeError
t[0] = 4

# List (Mutable)
l = [1, 2, 3]
# This will work fine
l[0] = 4
```

As you can see, once a tuple is created, we cannot change its contents. However, we can do that for a list. Immutable objects are very useful in functional programming since they help us write safer code.

#### Functional Programming Tools in Python

Python provides several built-in tools that allow us to write code in a functional style. Some of these include:
**Lambda Functions**: Lambda functions are anonymous functions in Python. They are used when a function is needed for a short period of time and is created with the lambda keyword.

```python
# Regular function
def square(x):
    return x ** 2

# Lambda function
square_lambda = lambda x: x ** 2

# Both functions work the same
assert square(5) == square_lambda(5)
```

<br><br>
map(): The map() function takes in a function and a list (or any iterable) and applies the function to each element of the list.

```python
numbers = [1, 2, 3, 4, 5]
squared = map(lambda x: x ** 2, numbers)
print(list(squared))  # Output: [1, 4, 9, 16, 25]
```

<br><br>
filter(): The filter() function also takes in a function and a list. The function should return a Boolean value, and filter() will return a new list containing only the elements for which the function returns True.

```python

numbers = [1, 2, 3, 4, 5]
even = filter(lambda x: x % 2 == 0, numbers)
print(list(even))  # Output: [2, 4]
```

<br><br>
reduce(): The reduce() function, which is found in the functools module, continuously applies a function to the elements of a list until only a single result is left.

```python

from functools import reduce

numbers = [1, 2, 3, 4, 5]
product = reduce(lambda x, y: x * y, numbers)
print(product)  # Output: 120
```

<br><br>
List Comprehension: This is a compact way of creating lists in Python. It's often used in place of map() and filter() for its readability.

```python

numbers = [1, 2, 3, 4, 5]
squared = [x ** 2 for x in numbers]
print(squared)  # Output: [1, 4, 9, 16, 25]
```

By making use of these tools, Python allows us to express our programs in a functional style, bringing in the benefits of functional programming into a language that also supports procedural and object-oriented paradigms.

## An Introduction to Key Concepts in Functional Programming

Functional Programming is more than just using `lambda`, `map()`, and `filter()` functions. It encompasses several key concepts that make it powerful and expressive. In this section, we will introduce and discuss three core concepts of functional programming: Pure Functions, Recursion, and Higher-Order Functions.

### Pure Functions

In functional programming, a pure function is a function that has the following properties:

1. Its return value is the same for the same arguments (i.e., it is deterministic).
2. Its evaluation has no side effects (i.e., it does not mutate any state or I/O operations).

Let's consider an example in Python:

```python
def pure_function(x, y):
    return 2 * x + y

print(pure_function(3, 4))  # Output: 10
print(pure_function(4, 2))  # Output: 10
```

In the example above, pure_function is a pure function. Given the same inputs, it will always return the same output, and it does not modify any states or perform any I/O operations.
Recursion

Recursion in functional programming is the process of solving a problem by having a function call itself as a subroutine. This might sound strange, but it can be a powerful way to break down complex problems into more manageable parts. Here's an example of calculating factorial using recursion:

```python

def factorial(n):
    if n == 0:
        return 1
    else:
        return n * factorial(n-1)

print(factorial(5))  # Output: 120
print(factorial(6))  # Output: 720
```

The factorial function calls itself to solve the problem, making it a recursive function.
Higher-Order Functions

In functional programming, a higher-order function is a function that does at least one of the following:

1. Takes one or more functions as arguments.
2. Returns a function as its result.

In Python, we have been using higher-order functions like map() and filter(). Let's look at another example:

```python

def apply_to_list(func, my_list):
    return [func(x) for x in my_list]

print(apply_to_list(lambda x: x ** 2, [1, 2, 3, 4]))  # Output: [1, 4, 9, 16]
```

In the above example,`apply_to_list` is a higher-order function. It accepts a function (func) and a list (my_list) as arguments, applies the function to every element of the list, and returns a new list.

Understanding these concepts will greatly help you in leveraging the power of functional programming in Python.

## Advanced Functional Programming in Python

Building upon the foundational principles, we can now explore some advanced functional programming concepts that Python supports: Function Composition, Currying, and Partial Function Application.

### Function Composition

Function composition is a mathematical concept that involves combining two or more functions in a way that the output of one function becomes the input of the next. In Python, function composition can be achieved by calling functions within functions. Let's define two simple functions:

```python
def multiply_by_two(x):
    return x * 2

def add_three(x):
    return x + 3
```

We can "compose" these functions together like this:

```python

def compose_multiply_then_add(x):
    return add_three(multiply_by_two(x))

print(compose_multiply_then_add(5))  # Output: 13
```

The compose_multiply_then_add function effectively combines or "composes" the two defined functions. First, it multiplies the input by two and then adds three to the result.

### Currying

Currying is the process of converting a function with multiple arguments into a sequence of functions, each with a single argument. For example, an addition function that takes two arguments can be curried into two functions, each taking one argument. Here's an example of a curried function in Python:

```python

def add(x):
  def add_inner(y):
    return x + y
  return add_inner

add_five = add(5)
print(add_five(3))  # Output: 8
```

In this example, the add function takes a single argument x and returns a new function add_inner that also takes a single argument. This is a demonstration of currying.
Partial Function Application

Partial function application is a process of fixing a number of arguments to a function, producing another function of smaller arity. Python's functools module provides the partial function to create partial functions. Here's an example:

```python

from functools import partial

def multiply(x, y):
    return x * y

double = partial(multiply, 2)

print(double(4))  # Output: 8
```

In the above example, the double function is a partial application of the multiply function where the first argument is fixed to 2.

These advanced functional programming concepts allow for even more flexible and powerful programming styles in Python, adding to the versatility of the language.

## Libraries for Functional Programming in Python

While Python's built-in features offer various ways to write functional-style programs, several libraries can help facilitate and extend the application of functional programming concepts in Python. Here are a few:

### functools

`functools` is a module for higher-order functions, functions that act on or return other functions. It provides tools for working with other functions and callable objects, to adapt or extend them for new uses without completely rewriting them. We have already seen an example of the `reduce()` function from this module. Other useful functions include `partial()` for partial function application, `lru_cache()` for memoization, and `total_ordering()` to add missing comparison methods to classes.

### itertools

`itertools` is a module for creating efficient looping constructs inspired by constructs from APL, Haskell, and SML. It includes functions for building more complex iteration patterns like "all possible combinations of this list" or "every consecutive subsequence of length n from this list". The functions provided are fast and memory efficient, and can be combined in a variety of ways.

```python
from itertools import combinations

for combo in combinations('ABCD', 2):
    print(combo)  # prints ('A', 'B'), ('A', 'C'), ('A', 'D'), ('B', 'C'), ('B', 'D'), ('C', 'D')
```

### toolz

toolz is a library for functional programming in Python that allows for the manipulation of functions in more versatile ways. It provides a set of utility functions for iterators, functions, and dictionaries. It includes functions for function currying, function composition, as well as advanced map, reduce, and filter functions.

```python

from toolz import compose

double = lambda i: i * 2
increment = lambda i: i + 1

double_then_increment = compose(increment, double)

print(double_then_increment(4))  # prints 9
```

### fn.py

fn.py is a library that aims to bring the power of some Scala-like features to Python and provide a chance to write purely functional code in more convenient and neat way. It includes a variety of tools for functional programming, including Scala-style lambdas, partial application, and function currying.

```python

from fn import _

print(((_ + 2) * 2)(10))  # prints 24
```

These libraries help enhance Python's capacity for functional programming, making it easier and more efficient to write functional-style code in Python.

## Practical Example of Functional Programming in Python

"Given a list of strings, find the total length of the strings that contain at least one uppercase letter and at least one digit".
Procedural Approach

The procedural approach would involve nested loops and condition checking:

```python

def sum_length(strings):
    total_length = 0
    for s in strings:
        has_upper = any(c.isupper() for c in s)
        has_digit = any(c.isdigit() for c in s)
        if has_upper and has_digit:
            total_length += len(s)
    return total_length

strings = ["Hello123", "world", "PYTHON", "2023", "Example456"]
print(sum_length(strings))  # Output: 18
```

In this solution, we loop over each string, then over each character in the string, checking if it's an uppercase letter or a digit. We use mutable state (total_length) to keep track of the total length.
Functional Approach

The functional approach would use Python's built-in functions and the functools and operator modules to achieve the same result with less explicit looping and no mutable state:

```python

from functools import reduce
import operator

def sum_length(strings):
    return reduce(
        operator.add,
        map(len,
            filter(lambda s:
                   any(c.isupper() for c in s)
                   and
                   any(c.isdigit() for c in s),
                strings)
            ),
        0
    )

strings = ["Hello123", "world", "PYTHON", "2023", "Example456"]
print(sum_length(strings))  # Output: 18
```

In this solution, we use filter to remove strings that don't meet the criteria, map to convert the remaining strings to their lengths, reduce to sum these lengths together, and lambda to define the needed functions inline.

This code might look more complex at first glance, but each operation is separated and there is no mutable state or explicit looping. Understanding and debugging this code involves tracking the transformations of the data, rather than the changes of state. With some practice, functional programming can lead to clearer, more maintainable code.

## Conclusion

Functional programming provides a unique approach to problem-solving which, when utilized well, can result in code that is more predictable, easier to test, and often more concise than its procedural or object-oriented counterparts. Its principles such as immutability, the use of pure functions, and the ability to use functions as first-class citizens offer a different perspective to approach programming problems.

In this article, we explored how Python, being a multi-paradigm language, supports functional programming along with other paradigms. We discussed how we can embrace functional programming in Python using built-in features such as lambda functions, map(), filter(), reduce(), and list comprehensions. We also dove into more advanced concepts such as function composition, currying, and partial function application.

Additionally, we explored libraries that facilitate functional programming in Python including functools, itertools, toolz, and fn.py. Finally, we got hands-on with a practical example that highlighted the difference between the imperative and functional approaches to solving the same problem.

While Python isn't a purely functional language like Haskell, Erlang or Racket, the principles of functional programming can greatly enhance your Python programs. By incorporating these principles, you can create code that is more modular, easier to understand, and simpler to debug.

Remember, the key is not to adhere strictly to one paradigm or another, but rather to understand the strengths of each and use them where they make the most sense in your code. As you continue your programming journey, I encourage you to embrace functional programming as another powerful tool in your toolbox. Happy coding!
