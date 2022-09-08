# Day 7 part 1

After parsing the list of horizontal positions, we use the `buildRange` function to build a list of all the possible positions that will yield the least fuel consumption for the alignment of the crabs' submarines.

> I have to admit that I got lazy here, I didn't perform any check on the parsed data, I just assumed it was correct and moved on to the interesting parts.

Once we have the range, we iterate over each potential position of that range to compute the fuel consumption for the distance between that position and the one for each crab's submarine. We get the consumption using `Math.abs(rangePosition - submarinePosition)`. We then sum these values to obtain the total fuel consumption for that range position.

After we have computed all the fuel consumptions for each position of the range, we simply select the minimum value with `A.reduce(+Infinity, Math.min)` to get the least fuel consumption amount.
