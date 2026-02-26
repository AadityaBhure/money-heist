export const PATH = {

  /* ---------- MAIN ---------- */
  q1: {
    text: `What is the output of the following C program?

#include <stdio.h>

int f(int n){
   static int x = 2;
   if(n == 0) return x;
   x *= 2;
   return f(n-1) + x;
}

int main(){
   printf("%d", f(2));
}`,
    answer: 24
  },

  /* ---------- FP2 BRANCH ---------- */
  q2: {
    text: "What is the maximum number of nodes in a binary tree of height 4?",
    answer: 31
  },

  q2L1: {
    text: `What is the output of the following code?

int x = 4, y = 3;
printf("%d", x + y << 1);`,
    answer: 14
  },

  q2R1: {
    text: "In a full binary tree with n internal nodes, how many leaves are there?",
    answer: "n+1"
  },

  q2R2: {
    text: `What is the output of the following code?

int i = 1, j = 1, count = 0;

while(i <= 100)
{
    j = 1;
    while(j <= i)
    {
        j *= 2;
        count++;
    }
    i *= 2;
}
printf("%d", count);`,
    answer: 28
  },

  q3: {
    text: "What is the minimum height of a Binary Search Tree with 15 nodes?",
    answer: 3
  },

  /* ---------- FP4 BRANCH ---------- */
  q4: {
    text: `What is the time complexity of the following function?

int f(int n){
    if(n<=1) return 1;
    return f(n-1) + f(n-1);
}`,
    answer: "o(2^n)"
  },

  q4L1: {
    text: `What is the output of the following Python code?

s = "ALGORITHM"
print(s[-3:7])`,
    answer: "TH"
  },

  q4L2: {
    text: "Time complexity of heap insertion?",
    answer: "logn"
  },

  q4R1: {
    text: `What is the output of the following code?

#include <stdio.h>
int main() {
    int arr[] = {10, 20, 30, 40};
    int *p = arr;
    printf("%d", *(p + 2));
}`,
    answer: 30
  }

};