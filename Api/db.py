import psycopg2
import os
def initializeDB():
    env = dict()
    if not os.path.exists("./.env"):
        # create .env file here
        print("Creating env file...")
        user = input("Enter database username: ")
        password = input("Enter database password: ")
        id = input("Enter admin space id: ")
        with open(".env", "x") as file:
            file.write("dbUser="+user+"\n")
            file.write("dbPassword="+password+"\n")
            file.write("adminDeviceSpaceId="+id+"\n")
            file.close()

    with open(".env", "r") as file:
        lines = file.readlines()
        for line in lines:
            kv = line.split('=')
            if len(kv) == 2:
                env[kv[0]] = kv[1].strip()
        file.close()
    return
    conn = psycopg2.connect(
        database="request", user=env["dbUser"], password=env["dbPassword"], host="127.0.0.1", port="5432"
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