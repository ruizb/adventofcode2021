# Day 7 part 2

The algorithm for this part is almost the same as the one we used in part 1. The only difference is when we compute the fuel consumption for the distance between the position in the range, and the position of the crab's submarine.

As soon as I saw the following in the description of this part:

> Instead, each change of 1 step in horizontal position costs 1 more unit of fuel than the last: the first step costs 1, the second step costs 2, the third step costs 3, and so on.

I knew I had to use the `(n * (n + 1)) / 2` formula that I encountered when reading the [Cracking the Coding Interview](https://www.crackingthecodinginterview.com/) book from Gayle Laakmann McDowell. In our case, `n` stands for the distance between the range position and the submarine's position.

In the first part, 1 unit of distance was equivalent to 1 unit of fuel, so `Math.abs(from - to)` worked.

In the second part though, 1 unit of distance yields a different unit of fuel, depending on how many units of distance there are. For a distance of `3`, the consumption is `1 + 2 + 3`. For a distance of `5`, it becomes `1 + 2 + 3 + 4 + 5`. Computing the sum of `1 + 2 + ... + n` is the same as computing `(n * (n + 1)) / 2`, this is why I used this formula to simply compute the fuel consumption in this challenge.
