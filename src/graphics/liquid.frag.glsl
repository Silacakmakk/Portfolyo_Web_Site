precision highp float;
varying vec2 v;uniform vec2 res;uniform float time;uniform vec2 mouse;uniform float power;uniform float change;uniform float section;uniform float night;uniform vec4 rings[6];
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.)),f.x),f.y);}
float fbm(vec2 p){float a=.5,n=0.;for(int i=0;i<4;i++){n+=a*noise(p);p=p*2.03+vec2(5.2,1.3);a*=.5;}return n;}
float caustic(vec2 p,float t){vec2 q=p;float c=0.;for(int i=0;i<3;i++){float k=float(i)+1.;q+=vec2(sin(q.y*1.4+t*.26+k),cos(q.x*1.3-t*.23+k))*.65;c+=1./(1.+18.*abs(sin(q.x*2.4+k)+cos(q.y*2.6-k)));}return c/3.;}
void main(){vec2 uv=v;float aspect=res.x/res.y;vec2 p=uv*vec2(aspect,1.);float t=time*.65;vec2 warp=vec2(fbm(p*2.+t*.06),fbm(p*2.-t*.05+7.));uv+=(warp-.5)*.1*power;float radial=0.;
for(int i=0;i<6;i++){vec4 r=rings[i];float age=time-r.z;if(age>0.&&age<3.){vec2 d=(v-r.xy)*vec2(aspect,1.);float dist=length(d);float envelope=exp(-pow((dist-age*.18)*9.,2.))*exp(-age*1.2);float wave=sin(dist*65.-age*11.)*envelope*r.w;uv+=normalize(d+vec2(.0001))*wave*.019*power;radial+=wave;}}
float burst=sin(length((v-mouse)*vec2(aspect,1.))*30.-time*2.)*change*.035;uv+=vec2(burst,burst*.6);p=uv*vec2(aspect,1.);
vec2 flow=p*1.45+vec2(section*.065,0.);flow+=vec2(fbm(p*1.6+t*.035),fbm(p*1.8-t*.028+8.))*.85;
float folds=sin(flow.x*3.4+sin(flow.y*3.1+t*.12)*1.3+fbm(flow*1.2)*2.8);
float silver=smoothstep(-.6,.95,folds);float depth=fbm(flow*1.7+vec2(t*.025,0.));
vec3 charcoal=vec3(.075,.078,.087),mid=vec3(.27,.265,.28),metal=vec3(.63,.615,.63);
vec3 col=mix(charcoal,mid,smoothstep(.2,.75,depth));col=mix(col,metal,silver*.68);
float pink=exp(-pow((uv.x-.79)*4.2,2.)-pow((uv.y-.35)*2.8,2.))*(.4+.6*depth);
col+=vec3(.13,.035,.05)*pink;
float c=caustic(flow*2.45+warp*.55,t*.65);float fine=pow(c,2.6);
col+=vec3(.94,.86,.85)*fine*.72;
float glow=exp(-abs(sin(flow.x*2.2+flow.y*2.6+sin(flow.y*2.1-t*.1)))*19.);
col+=vec3(.84,.80,.80)*glow*.22;
float softlight=exp(-pow((uv.x-.47)*3.8,2.)-pow((uv.y-.65)*2.4,2.));col+=vec3(.14,.13,.13)*softlight;
col+=radial*.025;col+=(hash(v*res)-.5)*.012;col*=mix(1.,.72,night);gl_FragColor=vec4(col,1.);}
