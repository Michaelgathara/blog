---
title: "Build a neural network from scratch"
date: "2023-11-19"
path: "/neural_network"
desc: "Implement a neural network from scratch in C++"
---

# Introduction
In today's world, neural networks have emerged as a cornerstone of artificial intelligence, revolutionizing fields from image recognition to natural language processing. These intricate systems, inspired by the biological brains, have the unique ability to learn and adapt, making them a powerful tool.

While there are numerous high-level libraries available for constructing neural networks, the true essence of their power and complexity can only be fully grasped by delving into their architecture. This is why we're taking a step back from the convenience of pre-built solutions to build a neural network from scratch.

In this blog post, I will guide you through the process of creating a basic neural network using C++. This exercise is not just about coding; it's about understanding the foundational principles that drives neural networks.

By the end of this blog post, you'll have a functional neural network built with your own hands and a deeper appreciation for the intricacies of this fascinating field. 

# Setting up the environment
Before diving into the world of neural networks, it's essential to set up the right environment for our coding journey. This setup is crucial because it ensures that you have all the necessary tools and frameworks to follow along with the tutorial and experiment on your own.

## Prerequisites
To get the most out of this tutorial, you should have a basic understanding of C++. If you're new to C++, it might be helpful to familiarize yourself with the basics of the language, especially concepts like classes, vectors, and functions.

Additionally, you'll need a C++ development environment. This could be an integrated development environment (IDE) like Visual Studio, Code::Blocks, or even a text editor with a command-line compiler like GCC or Clang (I personally use Clang). Choose the one that you're most comfortable with.

## Why C++ for Neural Networks?
You might wonder why we're using C++ for building a neural network, especially when other languages like Python are often seen as the go-to for AI and machine learning. The answer lies in C++'s efficiency and control over system resources. C++ offers a level of precision and performance optimization that is crucial for the heavy computational tasks involved in neural networks. This makes it an excellent choice for understanding the inner workings of these systems at a granular level. Python libraries also tend to be written in C, such as numpy.

## Setting Up Your Development Environment
Choose and Install an IDE or Compiler: If you haven't already, select and set up an IDE or a compiler on your machine. For beginners, an IDE might be more convenient as it provides a more user-friendly interface for coding and debugging.

Verify the Installation: Create a simple 'Hello World' program in C++ to ensure that your setup is working correctly.
```c
#include <iostream>

int main() {
    std::cout << "Hello World" << '\n';
    return 0;
}
```

Prepare for the Code: Create a new project or a file where you will write your neural network code. You can name it something like neural_network.cpp.

In the next section, we will start by laying the foundation of our neural network with some initial code.

# The Neural Network Code

Now that we've set up our environemtn are ready to delve into the heart of our project. We'll break down each part of the process to ensure you not only follow along but also grasp the why and how of each step

## Understanding the `NeuralNetwork` Class
At the core of our neural network is the `NeuralNetwork` class. This class serves as a blueprint of our network, it encapsulates all the properties and behaviors that define a basic neural network. 

```c
#include <iostream>
#include <vector>
#include <cmath>
#include <random>

class NeuralNetwork {
private:
    // Some private class members, which will be explained as we develop the network
    std::vector<std::vector<double>> hidden_weights; // A vector to hold our hidden weight
    std::vector<double> output_weights; // A vector to hold our output weights
    double hidden_bias; // A bias value for our hidden layer
    double output_bias; // A bias value for our hidden layer
    std::mt19937 gen; // A good random number generator, based on Mersenne Twister pseudorandom number generation
    std::uniform_real_distribution<> dis; // A template class that can be used to generate random numbers in an uniform distribution
public:
// Our actual network methods will go here
}
```

### Constructing the Network
The constructor of our `NeuralNetwork` class is where we begin. Here, we initialize the weights and biases - the adjustable parameters of our network. These parameters are what the network will 'learn' as it trains. To begin, we randomly intialize these values, although later we would like to setup a training method to change these weights.

```c
NeuralNetwork(int input_nodes, int hidden_nodes, int output_nodes) {
    // Constructor code will go here later
}
```

### Initializing the weights
Next, we initialize the weights. Weights are crucial as they determine the strength of the connection between nodes in different layers. In a neural network, learning primarily involves adjusting these weights based on the data. We initialize them randomly for now as we learn what a network is.

```c
NeuralNetwork(int input_nodes, int hidden_nodes, int output_nodes) {
    // Random init of the hidden weights
    hidden_weights.resize(hidden_nodes, std::vector<double>(input_nodes));
    for (int i = 0; i < hidden_nodes; i++) {
        for (int j = 0; j < input_nodes; j++) {
            hidden_weights[i][j] = dis(gen);
        }
    }

    // Random init of the output weights
    output_weights.resize(output_nodes);
    for (int i = 0; i < output_nodes; i++) {
        output_weights[i] = dis(gen);
    }
}
```

### Initializing Biases
After weights, we initialize the biases. Biases allow our network to shift the activation function to the left or right, which is crucial for properly fitting the data. Like weights, biases are also randomly initialized.

We have two biases in our network: hidden_bias for the hidden layer and output_bias for the output layer. Both are initialized using the same random distribution as the weights.

```c
hidden_bias = dis(gen); 
output_bias = dis(gen); 
```

### The Sigmoid Activation Function
Every neural network needs an activation function to introduce non-linearity, allowing it to learn and model complex patterns. In our case, we are using the sigmoid function. This function squashes the input values to a range between 0 and 1, which is particularly useful in binary classification problems.


```c
static double sigmoid(double x) {
    return 1.0 / (1.0 + exp(-x));
}
```

### Forward Propagation: Making Predictions
Forward propagation is where we calculate the output of the network. We take the input, apply weighted sums followed by the activation function, and pass it through the layers of the network. In our simple network, this means moving from the input layer, through the hidden layer, and finally to the output layer. This process is crucial as it's how the network makes predictions based on its learned parameters.

```c
std::vector<double> forward(const std::vector<double>& input) {
    // Forward propagation code will go here later
}
```

### Processing Input Through the Hidden Layer
The first step in forward propagation is to process the input data through the hidden layer of the network. For each neuron in the hidden layer, we compute a weighted sum of the inputs, adding the hidden bias to this sum.

```c
std::vector<double> forward(const std::vector<double>& input) {
    std::vector<double> hidden_values(hidden_weights.size(), 0.0);
    for (int i = 0; i < hidden_weights.size(); i++) {
        for (int j = 0; j < input.size(); j++) {
            hidden_values[i] += input[j] * hidden_weights[i][j];
        }
        hidden_values[i] += hidden_bias; // Adding the hidden bias
    }
}
```

### Applying the Activation Function
After calculating the weighted sums, we apply the activation function to these values. In our case, we use the sigmoid function. The activation function's role is to introduce non-linearity, allowing the network to learn and model complex patterns. It converts each neuron's weighted sum into a more standardized form.

```c
for (int i = 0; i < hidden_values.size(); i++) {
    hidden_values[i] = sigmoid(hidden_values[i]);
}

```

Tip: We can inline the loops above like so:
```c
std::vector<double> forward(const std::vector<double>& input) {
    std::vector<double> hidden_values(hidden_weights.size(), 0.0);
    for (int i = 0; i < hidden_weights.size(); i++) {
        for (int j = 0; j < input.size(); j++) {
            hidden_values[i] += input[j] * hidden_weights[i][j];
        }
        hidden_values[i] += hidden_bias; // Adding the hidden bias
        hidden_values[i] = sigmoid(hidden_values[i]); // Applying the activation function
    }
}
```

### Calculating the Output
Once we have the activated values from the hidden layer, we calculate the output. This is done by computing another weighted sum, this time using the output weights and adding the output bias. Essentially, we're aggregating the information processed by the hidden layer to produce a final output.

```c
double output_value = 0.0;
for (int i = 0; i < hidden_values.size(); i++) {
    output_value += hidden_values[i] * output_weights[i];
}
output_value += output_bias;
```

### Applying Activation to the Output
Finally, we apply the sigmoid activation function to this output value. This step is especially crucial in scenarios like binary classification, where the output needs to be a probability between 0 and 1.

```c
output_value = sigmoid(output_value);

return {output_value};
```

These above steps bring our forward function to look like so:

```c
std::vector<double> forward(const std::vector<double>& input) {
    std::vector<double> hidden_values(hidden_weights.size(), 0.0);
    for (int i = 0; i < hidden_weights.size(); i++) {
        for (int j = 0; j < input.size(); j++) {
            hidden_values[i] += input[j] * hidden_weights[i][j];
        }
        hidden_values[i] += hidden_bias;
        hidden_values[i] = sigmoid(hidden_values[i]);
    }

    double output_value = 0.0;
    for (int i = 0; i < hidden_values.size(); i++) {
        output_value += hidden_values[i] * output_weights[i];
    }
    output_value += output_bias;
    output_value = sigmoid(output_value);

    return {output_value};
}
```

This also concludes our `NeuralNetwork` function. We are now ready to test our network with inputs and outputs. 

### The main function
Finally, the `main` function acts as our testing ground. Here, we instantiate our neural network with specific parameters (like the number of nodes within each layer) and feed it some input data. The output we get helps us understand if our network is functioning as intended. 

```c
int main() {
    // Our testing ground
}
```

### Instantiating the Neural Network
The first step in the main function is to create an instance of our NeuralNetwork class. We need to specify the number of nodes in each layer (input, hidden, and output) when creating this instance. This configuration can be adjusted based on the specific requirements of the problem we're trying to solve.

```c
NeuralNetwork nn(5, 10, 1); // Example configuration with 5 input nodes, 10 hidden nodes, and 1 output node
```

### Providing Input Data
Next, we provide a set of inputs to our network. These inputs should be in the form of a vector, with each element corresponding to a node in the input layer of the network.

```c
std::vector<double> input = {0.5, 0.3, 0.2, 0.2, 0.1}; // Example input data
```

### Getting the Output
We then use the forward function of our neural network instance to get the output. This output is the network's prediction based on the input data and its current state (weights and biases).

```c
std::vector<double> output = nn.forward(input);
```

### Interpreting the Output
The output of the neural network, in this case, is a single value between 0 and 1, thanks to the sigmoid activation function. This value can be interpreted as the network's confidence in a certain prediction, especially in binary classification tasks. For instance, in a binary classification problem, a value close to 1 could indicate one class, while a value close to 0 could indicate the other.

```c
std::cout << "Output: " << output[0] << '\n';
```

Our main function in total looks like so:

```c
int main() {
    NeuralNetwork nn(5, 10, 1);
    std::vector<double> input = {0.5, 0.3, 0.2, 0.2, 0.1};
    std::vector<double> output = nn.forward(input);

    std::cout << "Output: " << output[0] << '\n';

    return 0;
}
```

By running the main function, we can observe how the neural network behaves with real input data. Keep in mind that since the weights and biases are initially randomized, the output at this stage may not be meaningful. It's after the process of training, where the network adjusts its weights and biases based on actual data, that the output starts to become a reliable prediction.

# Conclusion

By breaking down each component, we gain a deeper understanding of how a neural network operates from the inside out. It's not just about making it work; it's about knowing why it works. In the next section, we'll explore how to interpret the output of our network and understand the impact of our initial random parameters.

The entire network and a GPU version are available at: [My Github](https://github.com/Michaelgathara/neural-network-in-c)