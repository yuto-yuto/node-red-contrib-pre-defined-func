# node-red-contrib-pre-defined-func

This is a template to define a simple function in a node. If we write logic in a function node on a flow, it's hard to write tests for it. By defining the logic in this module, you can easily write tests. If you have multiple flows and need the same logic for those flows, this template is useful because we don't have to modify the code many times.

## Implementation

See ExampleStoreFunctions.ts for the implementation.

If you need a node that has two output, create a new node StoreFuncNode2.ts, StoreFuncNode2.html, and StoredFunctions2.
