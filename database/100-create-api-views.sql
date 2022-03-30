-- count of software per tag
CREATE FUNCTION count_software_per_tag() RETURNS TABLE (count BIGINT, tag tag) LANGUAGE plpgsql STABLE AS
$$
BEGIN
	RETURN QUERY SELECT
		COUNT(*),
		tag_for_software.tag
	FROM
		tag_for_software
	JOIN software ON
		tag_for_software.software = software.id
	GROUP BY
		tag_for_software.tag;
END
$$;

-- COUNT contributors per software
CREATE FUNCTION count_software_countributors() RETURNS TABLE (software UUID, contributor_cnt BIGINT) LANGUAGE plpgsql STABLE AS
$$
BEGIN
	RETURN QUERY SELECT
		contributor.software, COUNT(contributor.id) AS contributor_cnt
	FROM
		contributor
	GROUP BY
		contributor.software;
END
$$;

-- COUNT mentions per software
CREATE FUNCTION count_software_mentions() RETURNS TABLE (software UUID, mention_cnt BIGINT) LANGUAGE plpgsql STABLE AS
$$
BEGIN
	RETURN QUERY SELECT
		mention_for_software.software, COUNT(mention) AS mention_cnt
	FROM
		mention_for_software
	GROUP BY
		mention_for_software.software;
END
$$;

-- JOIN contributors and mentions counts per software
CREATE FUNCTION count_software_contributors_mentions() RETURNS TABLE (id UUID, contributor_cnt BIGINT, mention_cnt BIGINT) LANGUAGE plpgsql STABLE AS
$$
BEGIN
	RETURN QUERY SELECT
		software.id, count_software_countributors.contributor_cnt, count_software_mentions.mention_cnt
	FROM
		software
	LEFT JOIN
		count_software_countributors() AS count_software_countributors ON software.id=count_software_countributors.software
	LEFT JOIN
		count_software_mentions() AS count_software_mentions ON software.id=count_software_mentions.software;
END
$$;

-- Software maintainer by software slug
CREATE FUNCTION maintainer_for_software_by_slug() RETURNS TABLE (maintainer UUID, software UUID, slug VARCHAR) LANGUAGE plpgsql STABLE AS
$$
BEGIN
	RETURN QUERY SELECT
		maintainer_for_software.maintainer, maintainer_for_software.software, software.slug
	FROM
		maintainer_for_software
	LEFT JOIN
		software ON software.id = maintainer_for_software.software;
END
$$;

-- UNIQUE contributor display_names
CREATE OR REPLACE FUNCTION unique_contributors() RETURNS TABLE (display_name TEXT, affiliation VARCHAR, orcid VARCHAR, given_names VARCHAR, family_names VARCHAR, email_address VARCHAR, avatar_mime_type VARCHAR) LANGUAGE plpgsql STABLE AS
$$
BEGIN
	RETURN QUERY SELECT DISTINCT
		(CONCAT(c.given_names,' ',c.family_names)) AS display_name, c.affiliation, c.orcid, c.given_names, c.family_names, c.email_address, c.avatar_mime_type
	FROM
		contributor c
	ORDER BY
		display_name ASC;
END
$$;

-- Participating organisations by software
CREATE FUNCTION organisations_of_software() RETURNS TABLE (id UUID, slug VARCHAR, primary_maintainer UUID, name VARCHAR, ror_id VARCHAR, is_tenant BOOLEAN, website VARCHAR, logo_id UUID, status relation_status, software UUID) LANGUAGE plpgsql STABLE AS
$$
BEGIN
	RETURN QUERY SELECT
		organisation.id AS id,
		organisation.slug,
		organisation.primary_maintainer,
		organisation.name,
		organisation.ror_id,
		organisation.is_tenant,
		organisation.website,
		logo_for_organisation.id AS logo_id,
		software_for_organisation.status,
		software.id AS software
FROM
	software
INNER JOIN
	software_for_organisation ON software.id = software_for_organisation.software
INNER JOIN
	organisation ON software_for_organisation.organisation = organisation.id
LEFT JOIN
	logo_for_organisation ON logo_for_organisation.id = organisation.id;
END
$$;

-- Software count by organisation
CREATE FUNCTION software_count_by_organisation() RETURNS TABLE (organisation UUID, software_cnt BIGINT) LANGUAGE plpgsql STABLE AS
$$
BEGIN
	RETURN QUERY SELECT
		software_for_organisation.organisation, count(software_for_organisation.organisation) AS software_cnt
	FROM
		software_for_organisation
	GROUP BY software_for_organisation.organisation;
END
$$;

-- Organisations overview
CREATE FUNCTION organisations_overview() RETURNS TABLE (id UUID, slug VARCHAR, name VARCHAR, website VARCHAR, ror_id VARCHAR, logo_id UUID, software_cnt BIGINT) LANGUAGE plpgsql STABLE AS
$$
BEGIN
	RETURN QUERY SELECT
		o.id AS id, o.slug, o.name, o.website, o.ror_id, logo_for_organisation.id AS logo_id, software_count_by_organisation.software_cnt
	FROM
		organisation o
	LEFT JOIN
		software_count_by_organisation() ON software_count_by_organisation.organisation = o.id
	LEFT JOIN
		logo_for_organisation ON o.id = logo_for_organisation.id;
END
$$
