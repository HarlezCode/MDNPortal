import psycopg2

def initializeDB():
    conn = psycopg2.connect(
        database="request", user='postgres', password="123", host="127.0.0.1", port="5432"
    )
    conn.autocommit = True
    cursor = conn.cursor()
    cursor.execute("DROP TABLE IF EXISTS ENTRIES")
    sql = '''
CREATE TABLE ENTRIES(
    DTYPE TEXT,
    STATUS TEXT,
    SN TEXT,
    CLUSTERID TEXT,
    UID TEXT,
    CDATE CHAR(50),
    TOTYPE CHAR(20),
    MAC TEXT,
    RTYPE CHAR(255),
    FUSER CHAR(255),
    WEBCLIP CHAR(255),
    APP CHAR(255),
    TIMECREATED CHAR(255)
    )
    '''

    cursor.execute(sql)
    conn.close()