#include <stdlib.h>
#include <stdio.h>
#include <signal.h>
#include <string.h>
#include <fcntl.h>
#include <unistd.h>
#include <time.h>

char * buffer;
int iter =0;

void handler(int sign){
	printf("Hit signal\n");
	
	int fd;
	char filename[256];
	srand(time(0));
	sprintf(filename,"../crashes/%d_crash_%d%d.py",sign,rand(),rand());
	fd = open(filename,O_RDWR|O_CREAT);
	
	int i,j;
	char * tmp;
	char st[256];
	memset(st,0,256);
	sprintf(st, "import numpy as np\nprint \"currently on %d\"\n",iter-1);
	write(fd, st,strlen(st));
	iter--;
	for(j = 0; j<=32;j++){
		i = (iter+j)%32;

		tmp = buffer + 0x2000*i;
		memset(st,0,256);
		sprintf(st,"print \"# --- [%d]\"\n",i);
		write(fd,st,strlen(st));
/*		write(fd," ----------\n",12);
*/		
		write(fd,tmp,strlen(tmp));
		write(fd,"\n\n\n",3);
	}
	close(fd);

	exit(0);
}

void init(){
	printf("init handler");
	buffer = malloc(0x82000);
	signal(SIGSEGV,handler);
	signal(SIGABRT,handler);
}

void test(char * func){
	strncpy(buffer+0x2000*iter,func,0x40000);
	
	iter++;
	iter = iter%33;
}
