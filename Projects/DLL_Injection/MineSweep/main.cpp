#include <windows.h>
#include <stdio.h>
#include <stdlib.h>

BOOL APIENTRY DllMain (HINSTANCE hInst /* Library instance handle. */ ,
                 DWORD reason       /* Reason this function is being called. */ ,
                 LPVOID reserved /* Not used. */ )
{
    switch (reason)
    {
 case DLL_PROCESS_ATTACH:
     MessageBox (0, "Hello World from DLL!\n", "Hi", MB_ICONINFORMATION);
        break;

 case DLL_PROCESS_DETACH:
        break;

 case DLL_THREAD_ATTACH:
     MessageBox (0, "Hello World from DLL!\n", "Hi", MB_ICONINFORMATION);
        break;

 case DLL_THREAD_DETACH:
        break;
    }

    /* Returns TRUE on success, FALSE on failure */
    return TRUE;
}
