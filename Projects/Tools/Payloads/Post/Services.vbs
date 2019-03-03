' Simple script to list all services with path names that need to be fixed to raise security on a machine

set objWMI = GetObject("winmgmts:\\.\root\cimv2")
set objServices = objWMI.ExecQuery("Select * from Win32_Service")
set objFSO = CreateObject("Scripting.FileSystemObject")
set objShell = CreateObject("WScript.Shell")


outFile = objShell.ExpandEnvironmentStrings("%USERPROFILE%")+"\Desktop\outputfile.csv"
set objFile = objFSO.CreateTextFile(outFile,True)

for each service in objServices
    number = Int(InStr(service.PathName," "))
    if InStr(service.PathName, """")=0 and number and InStr(service.PathName, "svchost.exe")=0 then
		 'msgbox CStr(service.PathName) +" " + CStr(not mid(service.Pathname,number-4,4)=".exe")
        if not mid(service.Pathname,number-4,4)=".exe" then
            objFile.Write service.name + chr(44) + service.PathName + chr(13) + chr(10)
        end if
    end if
Next