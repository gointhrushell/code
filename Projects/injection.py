from ctypes import *
import sys
kernel32 = windll.kernel32

pid = int(input("Enter the pid of the process: "))
dll_path = input("Enter the full path of the dll: ")

print("Opening process")
hproc = kernel32.OpenProcess(0x1F0FFF,False,pid)
print("Allocating memory")
ADDRS = kernel32.VirtualAllocEx(hproc,0,len(dll_path),0x3000,0x04)
print("Writing into process")
kernel32.WriteProcessMemory(hproc,ADDRS,dll_path,len(dll_path),byref(c_ulong(0)))
print("Getting Module handle")
k32dll = kernel32.GetModuleHandleA("kernel32")
print("Getting Process Address")
loadlib_func = kernel32.GetProcAddress(k32dll,"LoadLibraryA")
print("Create Remote Thread")
if not kernel32.CreateRemoteThread(hproc,None,0,loadlib_func,ADDRS,0,byref(c_ulong(0))):
    print("Injection Failed")
    sys.exit(0)
else:
    print("Success")
