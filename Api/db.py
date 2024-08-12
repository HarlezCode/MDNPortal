import psycopg2
from keys import user, password
def initializeDB():
    conn = psycopg2.connect(
        database="request", user=user, password=password, host="127.0.0.1", port="5432"
    )
    conn.autocommit = True
    cursor = conn.cursor()
    cursor.execute("DROP TABLE IF EXISTS entries")
    cursor.execute("DROP TABLE IF EXISTS webclips")
    cursor.execute("DROP TABLE IF EXISTS clusterid")
    cursor.execute('''
CREATE TABLE entries(
    RTYPE VARCHAR(255),
    SN TEXT,
    CLUSTERID TEXT,
    STATUS TEXT,
    UID TEXT,
    CDATE VARCHAR(50),
    DTYPE TEXT,
    TOTYPE VARCHAR(20),
    FUSER VARCHAR(255),
    MAC TEXT,
    APP VARCHAR(255),
    WEBCLIP VARCHAR(255),
    TIMECREATED VARCHAR(255),
    ID SERIAL PRIMARY KEY,
    PROCESSED TEXT  
    );
    ''')
    cursor.execute('''
    CREATE TABLE webclips(
    MODEL text,
    dtype varchar(255),
    platform text,
    clstr text,
    os varchar(255),
    webclip text,
    id SERIAL primary key,
    active varchar(12)
    );
    ''')
    cursor.execute('''
    CREATE TABLE clusterid(
    VAL INT
    );
    INSERT INTO clusterid values(0);
    ''')

    conn.close()

if __name__ == "__main__":
    initializeDB()