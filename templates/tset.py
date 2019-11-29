class Solution:
  def isValid(self, s):
    closeB = ['}',']',')']
    openB = ['{','[','(']
    aList=[]
    for i in s : 
      if i in openB :
        aList.append(i)
      elif len(aList) == 0 :
        return False
      else :
        if aList[len(aList)-1] == '(' and i == ')':
          aList.pop()
        elif aList[len(aList)-1] == '{' and i == '}':
          aList.pop()
        elif aList[len(aList)-1] == '[' and i == ']':
          aList.pop()
        else : 
          return False
    if len(aList) > 0 :
      return False
    else : 
      return True


# Test Program
s = "{()()(()))"
# should return False
print(Solution().isValid(s))

s = ""
# should return True
print(Solution().isValid(s))

s = "([{}])()"
# should return True
print(Solution().isValid(s))