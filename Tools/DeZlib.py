import zlib
import sys

filename = sys.argv[1]
with open(filename,'rb') as compressed:
    data = compressed.read()
    fileno = 0
    
    while data:
        try:
            d = zlib.decompressobj()
        except:
            print("Not zlib data")
            sys.exit(0)
        with open('{}_decompressed_{}'.format(filename,fileno),'wb') as f:
            try:
                f.write(d.decompress(data))
            except:
                f.write(data)
                print(data)
                pass
            
        data = d.unused_data
        fileno+=1
