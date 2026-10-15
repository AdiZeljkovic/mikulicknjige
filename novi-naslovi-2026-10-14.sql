-- Novi naslovi — klijentov dokument „Sadržaj knjiga koji nedostaju 14 oktobar 2026"
-- 21 knjiga. Korice: public/images/knjige/<slug>.webp (originali u ../originali-korica/korice/novi-naslovi-2026-10-14/)
--
-- IDEMPOTENTNO: svaka knjiga se ubacuje samo ako ne postoji knjiga sa istim naslovom i autorom,
-- pa ponovno pokretanje ne duplira katalog.
--
--   docker compose exec -T db mariadb --default-character-set=utf8mb4 -u mikulic -p mikulic < novi-naslovi-2026-10-14.sql
--
-- createdAt je stepenovan tako da redoslijed na sajtu („Najnovija izdanja") prati redoslijed iz dokumenta.
-- „Kolumne iz tame regiona" je inStock = 0: klijent nije poslao opis ni cijenu (20 KM je privremena).

SET NAMES utf8mb4;

DROP TEMPORARY TABLE IF EXISTS novi_naslovi;
CREATE TEMPORARY TABLE novi_naslovi (
  rb INT NOT NULL,
  title VARCHAR(191) NOT NULL,
  author VARCHAR(191) NOT NULL,
  price DECIMAL(8,2) NOT NULL,
  imageUrl TEXT NOT NULL,
  description TEXT NULL,
  inStock TINYINT(1) NOT NULL
) DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

INSERT INTO novi_naslovi (rb, title, author, price, imageUrl, description, inStock) VALUES
(1, 'Odisejski beskraj, prva knjiga – Od Đulaginog dvora do odaja Zabranjenog grada u Pekingu', 'Slobodan Stajić Elefterios', 30.00, '/images/knjige/odisejski-beskraj-1.webp',
'Kao hodoljubnik autor je obišao 44 države na tri kontinenta (Evropi, Aziji i Africi), oplovio 12 mora i pedesetak ostrva, sabesjednikovao sa jednim okeanom, te hodočastio tragom “Ilijade” i “Odiseje”, potom putešestvija Argonauta do Kolhide u potrazi za Zlatnim runom, zatim tragom Aleksandra Makedonskog (gotovo sve do kamenih oltara na obalama Hifase), Sulejmana Veličanstvenog, vitezova Svetog Ivana (Kipar-Rodos-Malta), Marka Pola (od Venecije do Kine), “Orijent-ekspresa”... kao i tragom olimpijskog plama za 14. ZOI januara-februara 1983, godinu prije nego što je taj plam iz drevne Olimpije stigao u Sarajevo.', 1),

(2, 'Nafurani sin', 'Borivoje Simić', 20.00, '/images/knjige/nafurani-sin.webp',
'Savremeni psihološko-društveni roman koji istražuje složene porodične i društvene odnose.
Kroz ispovjedni ton i retrospektivna sjećanja, autor prikazuje lik čovjeka koji shvata da je bio zarobljenik očevih ambicija i vlastite slabosti.
Odnos oca i sina, moć i slabost, te privilegije i odgovornosti.', 1),

(3, 'Smrt fašizmu – sloboda narodu!', 'Grupa autora', 20.00, '/images/knjige/smrt-fasizmu.webp',
'Knjiga Smrt fašizmu je zbornik radova 26 autora koji tematiziraju savremene izazove i prijetnje demokratskim društvima u kontekstu rasta onoga što italijanski historičar Enzo Traverso definira kao "postfašizam". Knjiga predstavlja snažan odgovor na trendove historijskog revizionizma i relativizacije zločinačkih ideologija, podsjećajući da antifašizam nije tek naslijeđe prošlosti, već trajna društvena obaveza.', 1),

(4, 'Franjevci čuvari Bosne – Suputnici bosanske povijesti', 'Faruk Vele', 20.00, '/images/knjige/franjevci-cuvari-bosne.webp',
'U duhu afirmiranja mira i dobra, autor u knjizi donosi razgovore s istaknutim bosanskim franjevcima o Bosni i istinskim bosanskim vrijednostima. Važnost knjige jeste u tome da se pokažu istinske bosanske vrijednosti kod našeg bosanskog naroda, gdje su franjevci zajedno sa sufijama, dali izniman doprinos. Oni su na neki način simbol kontinuiteta državnosti BiH i čuvari državnosti na našem prostoru.', 1),

(5, 'Zemlja mržnje i beznađa', 'Margit Tomik Levi', 20.00, '/images/knjige/zemlja-mrznje-i-beznadja.webp',
'Autorica kaže „Konačno sam prelomila. Svi moji pokušaji da probudim svest građana BiH, da ih podsetim da im je BiH jedina domovina i da se moraju boriti za njeno očuvanje – bili su uzaludni. BiH je konačno podeljena po nacionalnim šavovima. Nisu samo političke propalice krive za ovo stanje. Toliko je malo ostalo BOSANACA, objektivnih i nepristrasnih građana da su apsolutno nevažni na političkoj karti naše zemlje. Svi brinu o svom narodu, gde god bio na ovoj planeti a niko o državi BiH. Zaboravlja se da samo ravnopravnost svakog građana donosi mir i stabilnost državi. Za BiH više nema nade. Ona više nikoga ne zanima. U BiH se tiho uvlačila mržnja, podele nove i svašta, netrpeljivost, šovinizam… da bi sada eskalirala. Rat na Bliskom istoku je „upalio svetlo“ da se vidi ko je kakav. Tek sada sam spoznala pravo lice mojih FB „prijatelja“. Mržnja, mržnja i nenormalno ponašanje…“', 1),

(6, 'Jugoslavija i Kosovo', 'Azem Vllasi', 30.00, '/images/knjige/jugoslavija-i-kosovo.webp',
'Knjiga Jugoslavija i Kosovo govori o odnosu Kosova i jugoslavenske države, s posebnim naglaskom na događaje koji su doveli do njenog raspada. Autor u knjizi daje i lična svjedočenja o posljednjim godinama SFRJ i analizira kako su političke odluke (posebno ukidanje autonomije Kosova 1989.) dovele do sukoba i raspada bivše države.
"Čitajući ovu knjigu shvatio sam mnoge stvari koje kao mlad čovjek osamdesetih i početkom devedesetih nisam mogao spoznati zbog medijske blokade i lažne slike koju su stvarali velikosrpski mediji. Danas se slažu kockice i izlazi na scenu istina o dugotrajnom nezadovoljstvu Albanaca na Kosovu, koje je rezultiralo protestima i zahtjevima za ravnopravnost", kaže Miro Lazović.', 1),

(7, 'Kolumne iz tame regiona', 'Dragan Bursać', 20.00, '/images/knjige/kolumne-iz-tame-regiona.webp',
NULL, 0),

(8, 'Duboki magnetizam nad Srbijom', 'Dušan Janjić', 20.00, '/images/knjige/duboki-magnetizam-nad-srbijom.webp',
'Duboki magnetizam nad Srbijom zbirka je eseja o političkim procesima i izazovima u Srbiji. Dušan Janjić je vrsni poznavalac političkih prilika u regionu bivše Jugoslavije.
Kolumne sabrane u zborniku, na metaforički način analiziraju fenomene magnetizma u Srbiji i na (Zapadnom) Balkanu, kao i „obojenu revoluciju” na primeru Srbije. Autor je inspiraciju za ovakav pristup našao u analizi Vladimira Ćurgusa Kazimira.
Ko je čitao Kazimirov esej mogao je da razume „magnetne turbulencije” u Bosni i njihovo širenje, osamdesetih i devedesetih godina prošlog veka, širom tadašnje zajedničke, a po nekima o Naše Bivše. Kazina ostavština pomaže da se razume i stvarnost Srbije i (Zapadnog) Balkana, 2025. godine. Ta stvarnost je osnovna tema kolumni sabranih u ovom zborniku. Ko nije čitao, nema mu pomoći. On ili one neće znati o otkriću podzemnog bogumilskog grada povezanog sa Vatikanom, o otkriću snova „patuljastih prastanovnika” ovog grada i Romanije. Neće znati ni da postoji neobična veza magnetizma i tadašnjih i kasnijih generacija stanovnika Bosne. Kao i Kazi i Autoru je čudno „kako takav narod nije mogao pronaći konačno rešenje za svoju neprirodnu vezu sa magnetizmom...”', 1),

(9, 'Ah, taj Balkan!', 'Hajrudin Somun', 20.00, '/images/knjige/ah-taj-balkan.webp',
'Knjiga "Ah, taj Balkan!" donosi autorski pogled Hajrudina Somuna na prostor Balkana, njegovu složenu historiju, ali i političke i društvene okolnosti koje su oblikovale ovaj dio Europe. „...Naravno da neće nestati kao geografska kategorija, ali bi mogao taj Zapadni Balkan kao politička kvazitvorevina Evropske unije, ukoliko bi nekim Božijim čudom 2025. godine sve balkanske države postale njene članice. Kako stvari stoje među ljudima i strankama koje vode njihove politike, to je gotovo nemoguće da se dogodi, a i vodeći čovjek EU Jean-Claude Juncker tako misli. On je nedavno ponovio „da nije za skori ulazak Zapadnog Balkana u Evropsku uniju“, ali nam ipak ljubazno ostavlja „evropsku perspektivu“.', 1),

(10, 'Naprijed, u prošlost!', 'Marinko Čulić', 20.00, '/images/knjige/naprijed-u-proslost.webp',
'Marinko Čulić jedan je od najistaknutijih i najčitanijih hrvatskih novinara posljednjih desetljeća. Čulić je godinama svojim lucidnim i analitičkim komentarima anticipirao političku i društvenu stvarnost, koja se neprestano nalazi u močvarnom okruženju iz kojeg se izlaz, i ako se nazire, nikada ne događa. U knjizi „Naprijed, u prošlost!“ sabrana su 53 njegova teksta.
„Među njegovim stalnim tematskim preokupacijama su hrvatsko-srpski odnosi, hrvatska politika prema BiH, odustajanje SDP-a od socijaldemokracije, demontaža socijalne države, porast nejednakosti u zemlji i svijetu te manjak političke vizije kod naših političara, čime se stvara, prema Čulićevoj ocjeni, ''paklenska formula besperspektivnosti''“ – rezimiralo je Hrvatsko novinarsko društvo.', 1),

(11, 'Kupleraj u balkanskom lavirintu', 'Nenad Čanak', 20.00, '/images/knjige/kupleraj-u-balkanskom-lavirintu.webp',
'Nenad Čanak jasno vođenom intelektualnom i političkom mišlju, sa izgrađenim stilom otvorio je prostor za dijalog o slobodi, otporu i identitetu u vremenu koje sve češće traži poslušnost umjesto misli. Njegova knjiga i sam naslov „Kupleraj u balkanskom lavirintu“ nije samo metafora, ona je savremeni sistem, uniformisan i tih, u kojem je različitost posljednji čin pobune. Ovo je djelo koje raskrinkava mehanizme totalitarizma, ispituje granice slobode i poziva na raskid sa uniformisanim mišljenjem.
Nenad Čanak je dokazani borac za pravdu i istinu kojeg će historija zapamtiti kao velikog i hrabrog čovjeka. I ovom knjigom to još jednom potvrđuje.
Knjigu preporučujemo bez imalo zadrške i molimo da se malo zamislite i promislite... O sebi, o društvu, o tome šta ste poduzeli a šta niste da vam bude bolje...', 1),

(12, 'Bella ciao', 'Neven Anđelić', 20.00, '/images/knjige/bella-ciao.webp',
'Bella ciao je zbirka kolumni Nevena Anđelića koje je autor objavljivao u različitim medijima u periodu od septembra 2009. do avgusta 2025. godine. To je razdoblje u kojem smo vjerovali da će nas liberalni kapitalizam, internet, demokratski principi i zdrav razum, ipak, spasiti od posljedica 11. septembra, kreditne krize i neizvjesnosti od nove podjele svijeta — a iz kojeg smo se probudili sa pedeset šest ratova u kojima učestvuje više od devedeset zemalja, sa 122 miliona izbjeglica, pandemijom, ponovnim usponom nacionalizma i populizma, te raspadom globalnog sela i međunarodnog poretka. I, naravno, s još uvijek nezavršenim ratom u Bosni i Hercegovini.
Anđelićeve kolumne predstavljaju originalnu, utemeljenu i nadasve izazovnu refleksiju o svijetu koji se raspao, i o svijetu koji se još ne zna, ili ne može, sastaviti.', 1),

(13, 'Vrijeme koje se pamti – Događaji i ličnosti', 'Raif Dizdarević', 50.00, '/images/knjige/vrijeme-koje-se-pamti.webp',
'Knjiga svjedočenja pod naslovom Vrijeme koje se pamti - Događaji i ličnosti predstavlja zbir fragmentarnih sjećanja na zbivanja i ličnosti koje su u autorovom dugom političkom životu/periodu djelovale na međunarodnoj sceni, njihovoj politici kao i o ulozi i interesima Jugoslavije. Izvori za ovaj djelimični uvid u međunarodne odnose bili su autorove bilješke i dokumenti u ličnoj arhivi koji su ponekad, kako sam navodi, zahtijevali dodatnu provjeru. Autorova politička analiza dotiče mnoga politička, jugoslavenska i svjetska pitanja, ali ne nameće nužne zaključke, ostavlja ih otvorene, između ostalog zbog odlaska sa političke scene 1989. godine. Nakon iscrpne analize složenih političkih odnosa u svijetu i zabilješki iz razgovora sa velikim brojem svjetski poznatih ličnosti, Dizdarević na kraju govori o svom iskustvu i angažiranju u toku rata u Bosni i Hercegovini. Kao političar u penziji nastojao je iskoristiti svoja privatna poznanstva i veze sa eminentnim ličnostima u svijetu objašnjavajući stvarno zbivanje i tražeći pomoć. Međutim, nakon neproduktivnih kontakata autor jasno iznosi razočarenje kako u svjetske snage tako i u bosanskohercegovačku vlast koja je, po njegovom mišljenju, mnoge stvari mogla uraditi drugačije...', 1),

(14, 'Pisma prijatelju – Svijet oko nas i mi u svijetu', 'Tomislav Jakić', 20.00, '/images/knjige/pisma-prijatelju.webp',
'Kroz gotovo tri desetljeća Tomislav Jakić je prezentator i komentator zbivanja na međunarodnoj sceni u TV Dnevniku, autor brojnih emisija na temu odnosa Istok - Zapad, kontrole naoružanja i Bliskoistočne krize. Kao posebni dopisnik izvještavao o ključnim događajima u svijetu, poput summita Carter – Brežnjev u Beču, vodio intervjue s nizom istaknutih političara onoga doba, prvenstveno zapadno-evropskih.
“Pisma prijatelju” od lipnja 2024. do lipnja 2025. neka je vrsta autorove profesionalne oporuke.', 1),

(15, 'Biblijska proročanstva nade', 'Tonćo Ladan', 30.00, '/images/knjige/biblijska-prorocanstva-nade.webp',
'Biblija, pisana Božja riječ, od svojih prvih stranica do posljednje, prožeta je nadom o boljoj budućnosti čovjeka i prirode - ne kao neizvjesnost koja plaši, nego kao obećanje koje poziva. U središtu te nade nalazimo proročanstva: riječi koje nadilaze povijesni trenutak, otvaraju pogled prema Božjem djelovanju u vremenu i podsjećaju čovjeka da povijest nije niz slučajnosti, nego priča koja ima cilj i smisao. U tom smislu, ova knjiga ne traži u proročanstvima znakove nadolazećih događaja, nego ih prepoznaje i tumači kao znakove Božje vjernosti kroz povijest.', 1),

(16, 'Štof za građansko odijelo', 'Vildana Selimbegović', 20.00, '/images/knjige/stof-za-gradjansko-odijelo.webp',
'... „Jedan od ključnih razloga zašto Oslobođenje izgleda tako kako izgleda i piše tako kao što piše, jeste njegova glavna urednica, Vildana Selimbegović, čiji izbor iz kolumni možemo pronaći u ovoj knjizi. Pri čemu Vildana ima tu nesreću ili izbor da piše političke kolumne ponedjeljkom, koje se bave gorućim, tj. aktualnim temama i koje takve po logici stvari prestaju biti aktualne već do sljedeće sedmice. To bi tako trebalo biti u teoriji. Ali, u praksi stvari su sasvim drugačije. Prvo zato što je ovdje politička i društvena nepomičnost skoro pa zadana, potom zbog studioznosti njenog pisanja, a na koncu i ništa manje bitno, zato jer se, kad se taj izbor iz kolumni ovako posloži, lako da razumjeti kako je riječ o procesima dugog trajanja, koje Vildana prepoznaje i prati. Ne bi stoga bilo pretjerano reći da će onaj tko pročita ovu knjigu kolumni moći steći adekvatan uvid u stvarnost Bosne i Hercegovine tridesetak godina nakon rata, u momentu kad su se svi optimizmi i nadanja pokazali kao iluzija. Nekoliko je dosljednih tematskih linija u Vildaninom pisanju. Prva jeste antifašizam, naglašavanje važnosti partizanske baštine i obračun s politikama koje tu baštinu dovode u pitanje. Drugi je dosljedni antinacionalizam prema svim trima stranama, koji naravno ne izjednačava njihovu krivnju za rat i aktualni društveno politički trenutak. Treći se odnosi na pisanje o situaciji u regiji i susjedstvu, iz kojeg je vidljivo da su Sarajevo i Oslobođenje možda i jedini prostor i medij koji još uvijek razumije da ovaj postjugoslavenski prostor funkcionira na neki jedinstven način i da ga je nemoguće razumjeti isključivo bavljenjem stvarima koje se događaju unutar vlastitih državnih granica. Na kraju, četvrta linija je ono što bi se moglo nazvati zdravorazumskim pisanjem, zbog kojeg autorica nailazi na najveća osporavanja u vlastitoj sredini, a to je linija ukazivanja na logičke paradokse političkog populizma u Sarajevu i na tragikomičnost njegovih nositelja...“', 1),

(17, 'Dedo, kupi mi ZAVNOBiH', 'Zlatko Dukić', 20.00, '/images/knjige/dedo-kupi-mi-zavnobih.webp',
'Ova knjiga je zbir 54 teksta a komentari u ovoj knjizi govore ono što je u tom času bilo aktuelno. Kako god se pogleda vidi se da su dominantne teme koje govore o problemima i o tome koliko je naša zemlja naopako napravljena posle Dejtonskog sporazuma. Naravno, to onome ko ne živi u BiH ne mora biti ni važno niti mnogo govoriti, a nama koji živimo tamo, pogotovo koji mislimo na to šta čeka naše potomke, to nije svejedno i to tera na brigu i na drastičan manjak optimizma kojeg je nažalost iz godine u godinu sve manje. U svojim tekstovima Dukić govori i o svim aktuelnim problemima u Bosni i Hercegovini sa akcentom na pojačanu fašizaciju tamošnjeg društva.
Autor kaže: „...Komentare pišem više od pola veka, prvi tekst sam napisao kao brucoš na Fakultetu političkih nauka u Sarajevu. Nije ovde problem u izostanku težine pisanja, problem je u tome što se piše, čak i kad predstavlja vrlo otvoreno iznošenje stava o onom što ne valja, ne izaziva reakciju onih na koje se to odnosi zato što oni koje ja kritikujem predstavljaju klasičan tip đon – obraza, jer šta god da im govorite to se njih ne tiče i oni rade po svome...“', 1),

(18, 'Farukov posljednji penal', 'Gigi Riva', 20.00, '/images/knjige/farukov-posljednji-penal.webp',
'Knjiga se bavi sudbonosnim jedanaestercem koji je Faruk Hadžibegić – kapiten i odbrambeni igrač reprezentacije Jugoslavije – promašio protiv Argentine u četvrtfinalu Svjetskog prvenstva u Italiji 1990. godine. Kroz priču o tom penalu, Gigi Riva (koji je proveo godine u opkoljenom Sarajevu i izuzetno je vezan za grad) istražuje širi društveni i historijski kontekst – simbolički krah zajedničke države pred početak ratnih sukoba na prostorima bivše Jugoslavije.', 1),

(19, 'Mirisi Sarajeva', 'Mašo Užičanin', 25.00, '/images/knjige/mirisi-sarajeva.webp',
'Mirisi Sarajeva knjiga je sjećanja... Nije riječ o mirisu somuna ili tucane kahve i slično (mada i to spominje) nego o mirisu prošlog vremena i nekog ranijeg Sarajeva. Međutim, autor na samom početku knjige jasno kaže da mu nije namjera kritizirati savremeno Sarajevo, niti podržava one koji kažu kako današnje Sarajevo nije što je nekad bilo („Ma nije! I ne može ni biti. A nije ni to što nam je nekad bilo – onako kako je nekad bilo prije toga. Čini mi se da posebno dijaspora žaluje za nekim prijašnjim Sarajevom i kritikuje ono kako je danas. Iako sam i ja „haman“ dijaspora – protivim se tome“).
Ovo je, dakle, knjiga sjećanja o minulom vremenu. Autor piše o svojoj porodici. Potiče iz porodice Užičanin, a njegov djed Omer-aga je imao 16 godina kada je prognan iz Užica i doselio se u Sarajevo i postao ugledni ćebedžija. Kada je umro 1939. iza sebe je ostavio 17 kuća i 28 dućana. Po majčinoj strani potiče iz porodice Nanić, koji su posjedovali niz skladišta i pilana oko Sarajeva. Bila je to vrlo bogata porodica. Autor u ovoj knjizi opisuje sudbinu porodice poslije 1945. godine (ko je sve „bacio oko“ na njihove vile, kako su nacionalizirani dućani...), ali je akcenat na njegovoj mladosti i životu u sarajevskoj mahali, potom školovanju, zaposlenju, društvenoj aktivnosti...', 1),

(20, 'Pero s onoga svijeta – Jebeš mir bez rata', 'Petar Luković', 20.00, '/images/knjige/pero-s-onoga-svijeta.webp',
'Petar Luković, jedan od najznačajnijih glazbenih kritičara u Jugoslaviji, i nakon njenog raspada glasni novinarski kritičar režima u Beogradu. Krvavi raspad Jugoslavije i pokušaj Srbije da oružjem zaustavi ostale republike da krenu svojim putem, nagnalo je Lukovića da zaboravi na glazbu i počne se baviti političkim novinarstvom. Publika ga je najbolje upoznala preko godina pisanja za splitski Feral Tribune, kroz kolumnu „Pero s onoga sveta“ iz čijih je tekstova javnost mogla čuti da preko Dunava postoji drugačija, građanska, nacionalno tolerantna i liberalna Srbija.
Ova knjiga je zbir tih kolumni.', 1),

(21, 'Globalno zaglupljivanje', 'Željko Ivanković', 20.00, '/images/knjige/globalno-zaglupljivanje.webp',
'Ova knjiga donosi izbor 30-ak kolumni iz zadnja dva perioda autorovog kolumnističkog rada, s tim što je prva kolumna u ovoj knjizi uzeta iz 2014. i ovdje je autor više smatra uvodnikom ili predgovorom za sve ono što slijedi, jer ona je vezana uz prvu rusku invaziju na Ukrajinu, točnije na Krim, kad se zapravo i otvorilo ono što se danas u najpesimističnijim krugovima smatra predsobljem Trećeg svjetskog rata.
“Pisati kolumne, koje neizbježno imaju i snažnu notu društvenog i političkog, za mene je uvijek značilo ostati u tračnicama onoga što su trasirala dvojica njemačkih književnih nobelovaca. Heinricha Bölla koji je rekao: „Umiješati se jedina je mogućnost ostati realističan!“ i Thomasa Manna: „Jer mislima kakve ti gajiš svojstvena je želja da ih se izrekne.“ koje doživljavam i kao vlastiti djelatni, intelektualni i moralni, dakle eminentno ljudski credo. I nikad me to „političko“ nije zanimalo kao dnevnopolitičko nego isključivo kao jedan od društvenih fenomena koji, najčešće agresivno, premrežuje sve segmente naših života…”', 1);

INSERT INTO `Book` (title, author, price, imageUrl, description, inStock, featured, createdAt, updatedAt)
SELECT n.title, n.author, n.price, n.imageUrl, n.description, n.inStock, 0,
       NOW(3) - INTERVAL n.rb SECOND, NOW(3)
FROM novi_naslovi n
WHERE NOT EXISTS (
  SELECT 1 FROM `Book` b WHERE b.title = n.title AND b.author = n.author
)
ORDER BY n.rb;

SELECT ROW_COUNT() AS ubaceno_knjiga;

DROP TEMPORARY TABLE novi_naslovi;
