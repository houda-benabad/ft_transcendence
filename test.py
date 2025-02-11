
def compress( chars):
        r = currCount = 1
        l = 0
        while r < len(chars):
            while chars[l] == chars[r]:
                currCount += 1
                chars.pop(r)
            chars[r] = str(currCount)
            currCount = 1
            l = r+1
            print('chat = ', chars[l])
            r+=1
        # print(chars)
        return len(chars)
    
print( compress( ["a","a","b","b","c","c","c"] ))