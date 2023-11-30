#include <stdio.h>

int main(void) {
    int i, j;

    
    printf("Enter the value for i: ");
    scanf("%d", &i);

    printf("Enter the value for j: ");
    scanf("%d", &j);

   
    if (i < j) {
        printf("i is less than j!\n");
    }

    return 0;