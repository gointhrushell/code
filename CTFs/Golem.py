import hashlib
from itsdangerous import URLSafeTimedSerializer
from flask.sessions import TaggedJSONSerializer

def decode_flask_cookie(secret_key, cookie_str):
    salt = 'cookie-session'
    serializer = TaggedJSONSerializer()
    signer_kwargs = {
        'key_derivation': 'hmac',
        'digest_method': hashlib.sha1
    }
    s = URLSafeTimedSerializer(secret_key, salt=salt, serializer=serializer, signer_kwargs=signer_kwargs)
    return s.loads(cookie_str)

def index():
    resp = make_response(render_template(...))
    resp.set_cookie('username', 'the username')
    return resp

print(decode_flask_cookie('7h15_5h0uld_b3_r34lly_53cur3d','eyJnb2xlbSI6bnVsbH0.DJY2OQ.W0oH1LLvu7LEiY-b6Hiejh12KL8'))

index()