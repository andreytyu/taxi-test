-- create trips table
create table trips ("id" numeric, "dt" timestamp,"lon" numeric,"lat" numeric);

-- copy trip data to table
copy trips from '/data/yellow_tripdata_2015.csv' delimiter ',' csv header;

-- create zones table
create table zones ("zone_id" numeric, "zone_name" varchar, "text_geom" varchar);

-- copy zones data to table
copy zones from '/data/zones.csv' delimiter ',' csv header;

-- add geometry columns to tables
SELECT AddGeometryColumn('zones', 'geom', 4326, 'MULTIPOLYGON',2);
SELECT AddGeometryColumn('trips', 'geom', 4326, 'POINT',2);

-- update columns with geometries and drop unneeded columns
UPDATE zones
SET geom = ST_SetSRID(st_geomfromtext(text_geom), 4326);
ALTER TABLE zones 
DROP COLUMN text_geom;

UPDATE trips
SET geom = ST_SetSRID(st_point(lon, lat), 4326);
ALTER TABLE trips 
DROP COLUMN lon;
ALTER TABLE trips 
DROP COLUMN lat;

-- create spatial index on geometry tables
CREATE INDEX trips_gix ON trips USING GIST (geom);
CREATE INDEX zones_gix ON zones USING GIST (geom);

-- aggregate point data by polygon
create table zones_agg 
as
SELECT zone_id,
zone_name,
(SELECT COUNT(*) FROM trips AS b WHERE
ST_Within(b.geom, zones.geom)) AS count,
geom
FROM zones;

-- create hourly data for the best zone
create table hour_agg as
select date_trunc('hour', dt) as dt, count(*) from (
SELECT dt,
	(
	select zone_id
	from zones as b
	where ST_Within(trips.geom, b.geom) and
	zone_id in
	(select zone_id from zones_agg order by count desc limit 1)
	) as zone_id
FROM trips ) in_best_zone where zone_id is not null
group by date_trunc('hour', dt);

