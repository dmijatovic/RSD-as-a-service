// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper.doi;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import java.net.URI;

public class OpenAlexCitationsTest {

	@Test
	void givenLocationWithBackSlashes_whenExtractedAsLocation_thenSlashesUrlEncoded() {
		JsonArray array = new JsonArray();
		// Example of the structure: https://api.openalex.org/works/https://doi.org/10.2777/28598
		JsonObject location = new JsonObject();
		location.addProperty("landing_page_url", "https://www.example.com/path\\with\\slash");
		array.add(location);

		URI result = OpenAlexCitations.extractUrlFromLocation(array);

		Assertions.assertNotNull(result);
		Assertions.assertEquals("https://www.example.com/path%5Cwith%5Cslash", result.toString());
	}
}
