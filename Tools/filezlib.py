import zlib
filename = '256221.zlib'
with open(filename,'rb') as compressed:
    data = compressed.read()
    fileno = 0
    
    while data:
        d = zlib.decompressobj()
        with open('{}_decompressed_{}'.format(filename,fileno),'wb') as f:
            try:
                f.write(d.decompress(data))
            except:
                f.write(data)
                print(data)
                pass
            
        data = d.unused_data
        fileno+=1
