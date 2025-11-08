---
title: "GPU programming with Apple Metal"
date: "2023-12-15"
path: "/apple_metal"
desc: "A somewhat brief GPU programming introduction using Apple's Metal framework"
---

# Introduction

In the diverse field of programming, an area that often goes unnoticed by many is GPU (Graphics Processing Unit) programming. This niche offers substantial power in computing, extending beyond mere graphics rendering. Apple's Metal, a robust framework, empowers developers to utilize the full potential of the integrated GPU in Appple's A and M series chips. It also excels in being, in my opinion, one of the more accessible GPU programming frameworks.

While for a significant number of programmers, the concept of GPU programming remains somewhat elusive, often viewed as a specialized area best left to experts. This blog post aims to shed light on the importance of GPU programming in the context of Apple Metal, highlighting its unique capabilities and the reasons it merits attention even from those who have traditionally focused on CPU-based programming. This post focuses more on GPUs capabilities to advance computational tasks as compared to rendering graphics.

# The Rise of GPU Computing

The evolution of computing has always been driven by the need for faster and more efficient processing. Traditionally, CPUs (Central Processing Units) were at the heart of all computing tasks. However, as the complexity and volumen of data grew, it became clear that a new approach was needed. This is where GPUs come into play. Unlike CPUs, which are designed to handle a few complex tasks at high speeds, GPUs excel in handling multiple tasks simultaneously. This capability makes them ideal for parallel processing, a requirement in both advanced graphics rendering and heavy computational tasks.

# Apple Metal

Apple Metal stands out in GPU programming for a few key reasons. First and foremost, its integration with Apple's hardware - specifically the A and M series chips - ensures optimal performance and efficiency. Metal is designed to maximize the potential of these chips, leading to faster and more power-efficient applications.

Futhermore, Metal is not just about graphics. It provides extensive support for compute tasks, making it a valuable tool for a wide range of applications beyond the typical gaming and graphics rendering. From machine learning to scientific simulations, Metal can accelerate tasks that would otherwise take a significant amount of time on a CPU.

## Key Features of Apple Metal

1. **Low-Overhead Architecture:** Metal is designed to minimize the communication overhead between the application and the GPU, allowing for faster and more efficient processing of tasks.
2. **Advanced Shading Language:** Metal Shading Language (MSL) offers a rich set of features that allow developers to write high-performance code specifically for the GPU.
3. **Unified Memory Access:** With Apple's latest hardware, Metal provides unified memory access, which simplifies the programming model and increases performance by allowing the CPU and GPU to share data more efficiently.
4. **Comprehensive Tooling:** Metal comes with a suite of tools that help in debugging and optimizing GPU tasks. This makes the development process more accessible and efficient.

## Getting Started with Metal

For those who are new to GPU programming, starting with Metal can be a less daunting experience. Apple provides extensive documentation and tutorials, which are great resources. For this post, a basic understanding of swift is a plus, however, not neccesary.

### Pre-reqs

- A Mac with macOS 10.11 El Capitan +
- Xcode

### Xcode Project Setup

- Open Xcode
- Select "Command Line Tool" under the macOS tab as your template
- Fill in your project details and make sure to select "Swift" as the language.

### Creating your first project

We will create a program that compares the speed of adding each index within two arrays on the CPU vs GPU

1. Importing MetalKit
   In your Swift file, import the Metal framework:

```swift
import MetalKit
```

2. Defining Global Variables:
   We'll define a constant for the size of our arrays and initialize two arrays with random floating point numbers

```swift
let count: Int = 3_000_000
var firstArray = createArray() // The createArray() function will create arrays of count length
var secondArray = createArray()
```

3. Create your createArray() function

```swift
func createArray() -> [Float] {
    var res = [Float](repeating: 0.0, count: count)
    for i in 0..<count {
        res[i] = Float(arc4random_uniform(count))
    }
    return res
}
```

4. CPU-Based Array Addition Function
   This function adds the elements of two arrays using a standard for loop:

```swift
func CPU(arr1: [Float], arr2: [Float]) -> [Float] {
    let startTime = CFAbsoluteTimeGetCurrent()
    var res = [Float](repeating: 0.0, count: count)
    for i in 0..<count {
        res[i] = arr1[i] + arr2[i]
    }
    let elapsed = CFAbsoluteTimeGetCurrent()
    print("CPU elapsed time: \(String(format: "%0.05f", elapsed)) seconds")
    return res
}
```

5. GPU-Based Array Addition Function
   This function will add the elements of the two arrays on the GPU

```swift
func GPU(arr1: [Float], arr2: [Float]) -> [Float] {
    let startTime = CFAbsoluteTimeGetCurrent()

    // Now define your GPU device. There should only be one
    let device = MTLCreateSystemDefaultDevice() // This should be your GPU.

    // The command queue will handle our execution order
    let commandQueue = device?.makeCommandQueue()

    // This loads the default libary which contains GPU functions
    let gpuFunc = device?.makeDefaultLibrary()

    // This will load our 'add' function that we will declare later
    let GPUadd = gpuFunc?.makeFunction(name: "add")

    /* Here we define the pipeline state.
    * Pipelines in the GPU context are essentially a series of steps the GPU will follow to accomplish something
    * This idea comes from how GPUs are usually used to render graphics which are done in steps
    */
    var addPipelineState: MTLComputePipelineState!
    do {
        addPipelineState = try device?.makeComputePipelineState(function: GPUadd!)
    } catch {
        print(error)
    }

    /* Here we create storage buffers for the two arrays we have
    * We make sure to do a shared storage mode, which makes this buffer available to both the CPU and GPU
    * This is a key advantage that comes from unified memory architecture platforms
    */
    let arr1Buffer = device?.makeBuffer(bytes: arr1,
                                        length: MemoryLayout<Float>.size * count,
                                        options: .storageModeShared)
    let arr2Buffer = device?.makeBuffer(bytes: arr2,
                                        length: MemoryLayout<Float>.size * count,
                                        options: .storageModeShared)
    let resBuffer = device?.makeBuffer(length: MemoryLayout<Float>.size * count,
                                       options: .storageModeShared)

    // Create a command buffer to encode GPU commands
    let commandBuffer = commandQueue?.makeCommandBuffer()

    // Create a compute command encoder
    let commandEncoder = commandBuffer?.makeComputeCommandEncoder()

    // Set the pipeline state for the encoder
    commandEncoder?.setComputePipelineState(addPipelineState)

    // Set the first buffer as input for the first array
    commandEncoder?.setBuffer(arr1Buffer, offset: 0, index: 0)

    // Set the second buffer as input to the GPU for the second array
    commandEncoder?.setBuffer(arr2Buffer, offset: 0, index: 1)

    // Set the result buffer as output from the GPU for the result array
    commandEncoder?.setBuffer(resBuffer, offset: 0, index: 2)

    // Define the total number of threads in the grid
    let threadsPerGrid = MTLSize(width: count, height: 1, depth: 1)

    // Get the maximum number of threads per thread group
    let maxThreadsPerThreadGroup = addPipelineState.maxTotalThreadsPerThreadgroup

    // Define the number of threads in each thread group
    let threadsPerThreadGroup = MTLSize(width: maxThreadsPerThreadGroup, height: 1, depth: 1)

    // Dispatch threads to the GPU
    commandEncoder?.dispatchThreads(threadsPerGrid, threadsPerThreadgroup: threadsPerThreadGroup)

    // Finish encoding commands for the GPU
    commandEncoder?.endEncoding()

    // Commit the command buffer to send commands to the GPU
    commandBuffer?.commit()

    commandBuffer?.waitUntilCompleted() // Wait for all GPU operations to complete

    // Bind the result buffer's memory for CPU access for later
    var resBufferPointer = resBuffer?.contents().bindMemory(to: Float.self,
                                                            capacity: MemoryLayout<Float>.size * count)

    // Create an array to store the results
    var res = [Float](repeating: 0.0, count: count)

    // Copy data from the GPU buffer to the CPU array. The copying of data from the GPU to CPU or vice versa is something you will find yourself doing a lot, especially in platforms that don't share memory
    if let resBufferPointer = resBuffer?.contents() {
        memcpy(&res, resBufferPointer, count * MemoryLayout<Float>.size)
    }

    let elapsed = CFAbsoluteTimeGetCurrent() - startTime
    print("GPU elapsed time: \(String(format: "%0.05f", elapsed)) seconds")

}
```

6. Metal GPU program
   To run a program on the GPU you need to write a kernel file.

```c
#include <metal_stdlib>
using namespace metal;

kernel void add(constant float *arr1 [[ buffer(0) ]],
                constant float *arr2 [[ buffer(1) ]],
                device   float *res [[ buffer(2) ]],
                uint idx [[ thread_position_in_grid ]]) {
    res[idx] = arr1[idx] + arr2[idx];
}
```

7. Now we call our functions and see the results

```swift
// acquire your results from both the CPU and GPU
var CPUarray = CPU(arr1: firstArray, arr2: secondArray)
var CPUarray = CPU(arr1: firstArray, arr2: secondArray)
```

### Comparison

After walking through creating a basic Metal program that performs array addition, it's good to analyze and compare the performance outcomes between CPU and GPU processing. The essence of this comparison lies in understanding the inherent architectural differences between CPUs and GPUs.

CPUs, with their limited number of cores capable of handling complex tasks and higher clock speeds, excel in sequential task processing. GPUs, on the other hand, boast a massive number of cores designed for parallel data processing. This fundamental difference is where the power of GPU programming, especially with Apple Metal, becomes evident.

In our example, adding elements of two large arrays is a task perfectly suited for parallel processing. Here, each addition operation is independent and can be performed simultaneously. The GPU leverages its multitude of cores to process large chunks of the data in parallel, significantly reducing the total computation time compared to the CPU's sequential processing.

Upon running our program, you might observe something like this:

**CPU Performance:** The CPU-based array addition might take several seconds, illustrating the linear approach of tackling each operation one after another.
**GPU Performance:** The GPU, utilizing Apple Metal, completes the same task in a fraction of the time. This speedup showcases the GPU’s ability to handle numerous operations concurrently.

### Real-World Implications

This performance disparity has profound implications in real-world applications. For tasks such as image processing, simulations, or data analysis, leveraging the GPU can lead to significant performance enhancements. In the context of Metal, this means that applications running on Apple's hardware can achieve remarkable efficiency and speed, making the most of the A and M series chips’ capabilities.

## Code

The code for this post can be found on github [here](https://github.com/Michaelgathara/metal)
