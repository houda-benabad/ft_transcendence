def bitlen(num):
    n = num 
    bitlen = 0
    while n > 0:
        n = n>> 1
        bitlen += 1
    return bitlen


def maxXor(num):
    bitLen = bitlen(num)
    res = 0
    print(bitlen(num))
    i = 0
    while (i > 0):
        if (bitlen(i) == bitLen):
            res += 1
        if (res >= bitLen):
            return res

print(maxXor(4))