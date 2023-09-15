// SPDX-FileCopyrightText: 2023 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2023 Felix Mühlbauer (GFZ) <felix.muehlbauer@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2023 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.google.gson.JsonObject;

import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import io.restassured.http.Header;
import io.restassured.response.Response;
import io.restassured.specification.RequestSpecification;

import org.hamcrest.CoreMatchers;
import org.hamcrest.Matchers;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.Date;
import java.util.List;

public class AuthenticationIntegrationTest {

	static Header adminAuthHeader;

	@BeforeAll
	static void checkBackendAvailable() throws InterruptedException {
		URI backendUri = URI.create(System.getenv("POSTGREST_URL"));
		HttpClient client = HttpClient.newHttpClient();
		HttpRequest request = HttpRequest.newBuilder(backendUri).build();
		int maxTries = 30;
		for (int i = 1; i <= maxTries; i++) {
			try {
				client.send(request, HttpResponse.BodyHandlers.discarding());
				System.out.println("Attempt %d/%d to connect to the backend on %s succeeded, continuing with the tests"
						.formatted(i, maxTries, backendUri));
				return;
			} catch (IOException e) {
				System.out.println("Attempt %d/%d to connect to the backend on %s failed, trying again in 1 second"
						.formatted(i, maxTries, backendUri));
				Thread.sleep(1000);
			}
		}
		throw new RuntimeException("Unable to make connection to the backend with URI: " + backendUri);
	}

	@BeforeAll
	static void setupRestAssured() {
		String backendUri = System.getenv("POSTGREST_URL");
		RestAssured.baseURI = backendUri;
		RestAssured.enableLoggingOfRequestAndResponseIfValidationFails();

		String secret = System.getenv("PGRST_JWT_SECRET");
		Algorithm signingAlgorithm = Algorithm.HMAC256(secret);

		String adminToken = JWT.create()
				.withClaim("iss", "rsd_test")
				.withClaim("role", "rsd_admin")
				.withExpiresAt(new Date(System.currentTimeMillis() + 1000 * 60 * 60)) // expires in one hour
				.sign(signingAlgorithm);
		adminAuthHeader = new Header("Authorization", "bearer " + adminToken);

		User.adminAuthHeader = adminAuthHeader;
	}

	@Test
	void givenAdmin_whenCreatingAccount_thenSuccess() {
		User.create(false);
	}

	@Test
	void givenUserWithoutAgreeingOnTerms_whenCreatingSoftware_thenNotAllowed() {
		User user = User.create(false);

		String expectedMessage = "You need to agree to our Terms of Service and the Privacy Statement before proceeding. Please open your user profile settings to agree.";
		RestAssured.given()
				.header(user.authHeader)
				.contentType(ContentType.JSON)
				.body("{\"slug\": \"test-slug-user\", \"brand_name\": \"Test software user\", \"is_published\": true, \"short_statement\": \"Test software for testing\"}")
				.when()
				.post("software")
				.then()
				.statusCode(400)
				.body(CoreMatchers.containsString(expectedMessage));
	}

	@Test
	void givenUserWhoAgreedOnTerms_whenCreatingAndEditingSoftware_thenSuccess() {
		User user = User.create(false);

		RestAssured.given().log().all()
				.header(user.authHeader)
				.contentType(ContentType.JSON)
				.body("{\"agree_terms\": true, \"notice_privacy_statement\": true}")
				.when()
				.patch("account?id=eq." + user.accountId)
				.then()
				.statusCode(204);

		String slug = Commons.createUUID();
		RestAssured.given()
				.header(user.authHeader)
				.contentType(ContentType.JSON)
				.body("{\"slug\": \"%s\", \"brand_name\": \"Test software user\", \"is_published\": true, \"short_statement\": \"Test software for testing\"}"
						.formatted(slug))
				.when()
				.post("software")
				.then()
				.statusCode(201);

		String getStartedUrl = "https://www.example.com";
		String patchedGetStartedUrl = RestAssured.given()
				.header(user.authHeader)
				.header(Commons.requestEntry)
				.contentType(ContentType.JSON)
				.body("{\"get_started_url\": \"%s\"}".formatted(getStartedUrl))
				.when()
				.patch("software?select=get_started_url&slug=eq." + slug)
				.then()
				.statusCode(200)
				.extract()
				.path("[0].get_started_url");
		Assertions.assertEquals(getStartedUrl, patchedGetStartedUrl);
	}

	@Test
	void givenUserWhoAgreedOnTerms_whenEditingSoftwareNotMaintainer_thenNowAllowed() {
		String slug = Commons.createUUID();
		RestAssured.given()
				.header(adminAuthHeader)
				.contentType(ContentType.JSON)
				.body("{\"slug\": \"%s\", \"brand_name\": \"Test software user\", \"is_published\": true, \"short_statement\": \"Test software for testing\"}"
						.formatted(slug))
				.when()
				.post("software")
				.then()
				.statusCode(201);

		User user = User.create(false);

		RestAssured.given()
				.header(user.authHeader)
				.contentType(ContentType.JSON)
				.body("{\"agree_terms\": true, \"notice_privacy_statement\": true}")
				.when()
				.patch("account?id=eq." + user.accountId)
				.then()
				.statusCode(204);

		String getStartedUrl = "https://www.example.com";
		List response = RestAssured.given()
				.header(user.authHeader)
				.header(new Header("Prefer", "return=representation"))
				.contentType(ContentType.JSON)
				.body("{\"get_started_url\": \"%s\"}".formatted(getStartedUrl))
				.when()
				.patch("software?select=get_started_url&slug=eq." + slug)
				.then()
				.statusCode(200)
				.extract()
				.body()
				.as(List.class);
		Assertions.assertTrue(response.isEmpty());
	}

	@Test
	void givenUnauthenticatedUser_whenViewingTables_thenSuccess() {
		RestAssured
				.when()
				.get("software")
				.then()
				.statusCode(200);

		RestAssured
				.when()
				.get("project")
				.then()
				.statusCode(200);
	}

	@Test
	void givenUnauthenticatedUser_whenViewingUnpublishedSoftware_thenNothingReturned() {
		String slug = Commons.createUUID();
		RestAssured.given()
				.header(adminAuthHeader)
				.contentType(ContentType.JSON)
				.body("{\"slug\": \"%s\", \"brand_name\": \"Test software user\", \"is_published\": false, \"short_statement\": \"Test software for testing\"}"
						.formatted(slug))
				.when()
				.post("software")
				.then()
				.statusCode(201);

		List response = RestAssured.when()
				.get("software?slug=eq." + slug)
				.then()
				.statusCode(200)
				.extract()
				.body()
				.as(List.class);
		Assertions.assertTrue(response.isEmpty());
	}

	@Test
	void givenUnauthenticatedUser_whenEditingAnyTable_thenNotAllowed() {
		RestAssured.given()
				.contentType(ContentType.JSON)
				.body("{\"short_statement\": \"invalid statement\"}")
				.when()
				.patch("software")
				.then()
				.statusCode(401);

		RestAssured.given()
				.contentType(ContentType.JSON)
				.body("{\"subtitle\": \"invalid subtitle\"}")
				.when()
				.patch("project")
				.then()
				.statusCode(401);
	}

	/*
	 * ============================
	 * === Tests for categories ===
	 * ============================
	 */

	@Test
	void givenUnauthenticatedUser_createCategory() {
		requestCreateDummyCategory(null)
				.then()
				.statusCode(401);

	}

	@Test
	void givenAuthenticatedUser_createCategory() {
		requestCreateDummyCategory(User.create().authHeader)
				.then()
				.statusCode(403);
	}

	@Test
	void givenAdmin_createCategory() {
		requestCreateDummyCategory(adminAuthHeader)
				.then()
				.statusCode(201);
	}

	@Test
	void assignCategory_toOwnSoftware() {
		String categoryId = createUniqueCategory("long name", "short name", null);

		User user = User.create();
		String softwareId = user.createSoftware("Software 1");
		requestAddCategoryForSoftware(user, softwareId, categoryId)
				.then()
				.statusCode(201);
	}

	@Test
	void assignCategory_toNotOwnSoftware() {
		String categoryId = createUniqueCategory("long name", "short name", null);

		User user1 = User.create();
		String softwareId = user1.createSoftware("Software 1");

		User user2 = User.create();
		requestAddCategoryForSoftware(user2, softwareId, categoryId)
				.then()
				.statusCode(403);
	}

	@Test
	void checkRPC_categoryPathsBySoftwareExpanded() {
		String[] catIds = createCategoryTreeExample1();

		User user = User.create();
		String softwareId = user.createSoftware("Software 1");

		addCategoryForSoftware(user, softwareId, catIds[0]);
		addCategoryForSoftware(user, softwareId, catIds[1]);

		JsonObject obj = new JsonObject();
		obj.addProperty("software_id", softwareId);

		RestAssured.given()
				.contentType(ContentType.JSON)
				.body(obj.toString())
				.when()
				.post("/rpc/category_paths_by_software_expanded")
				.then()
				.contentType(ContentType.JSON)
				// check if category IDs appear in proper location of result (=CategoryPath[])
				.body("[0][1].id", CoreMatchers.equalTo(catIds[0]))
				.body("[1][1].id", CoreMatchers.equalTo(catIds[1]));
	}

	@Test
	void categoriesMustNotContainCycles() {
		String catId1 = createUniqueCategory("category 1", "category 1", null);
		String catId2 = createUniqueCategory("category 2", "category 2", catId1);
		String catId3 = createUniqueCategory("category 3", "category 3", catId2);

		// now patch parent of category 1 to category 3
		JsonObject obj = new JsonObject();
		obj.addProperty("parent", catId3);

		RestAssured.given()
				.header(adminAuthHeader)
				.contentType(ContentType.JSON)
				.body(obj.toString())
				.when()
				.patch("category?id=eq." + catId1)
				.then()
				.statusCode(400)
				.body("message", Matchers.containsStringIgnoringCase("cycle detected"));
	}

	String[] createCategoryTreeExample1() {
		String catId1 = createUniqueCategory("top level 1", "top level 1 long", null);
		String catId1_1 = createUniqueCategory("sub category 1.1", "sub category 1.1 long", catId1);
		String catId1_2 = createUniqueCategory("sub category 1.2", "sub category 1.2 long", catId1);
		String catId2 = createUniqueCategory("top level 2", "top level 2 long", null);
		String catId2_1 = createUniqueCategory("sub category 2.1", "sub category 2.1 long", catId2);
		String catId2_2 = createUniqueCategory("sub category 2.2", "sub category 2.2 long", catId2);
		return new String[] { catId1_1, catId1_2, catId2_1, catId2_2 };
	}

	String createCategory(String name, String short_name, String parentId, boolean makeUnique) {

		if (makeUnique) {
			String unique = " (" + Commons.createUUID() + ")";
			name += unique;
			short_name += unique;
		}

		JsonObject obj = new JsonObject();
		obj.addProperty("name", name);
		obj.addProperty("short_name", short_name);
		obj.addProperty("parent", parentId);

		return RestAssured.given()
				.header(adminAuthHeader)
				.header(Commons.requestEntry)
				.contentType(ContentType.JSON)
				.body(obj.toString())
				.when()
				.post("category")
				.then()
				.statusCode(201)
				.extract()
				.path("[0].id");
	}

	String createUniqueCategory(String name, String short_name, String parentId) {
		return createCategory(name, short_name, parentId, true);
	}

	void addCategoryForSoftware(User user, String softwareId, String categoryId) {
		requestAddCategoryForSoftware(user, softwareId, categoryId)
				.then()
				.statusCode(201);
	}

	Response requestAddCategoryForSoftware(User user, String softwareId, String categoryId) {

		JsonObject obj = new JsonObject();
		obj.addProperty("software_id", softwareId);
		obj.addProperty("category_id", categoryId);

		return RestAssured.given()
				.header(user.authHeader)
				.contentType(ContentType.JSON)
				.body(obj.toString())
				.when()
				.post("category_for_software");
	}

	Response requestCreateDummyCategory(Header authHeader) {

		String unique = Commons.createUUID();

		JsonObject obj = new JsonObject();
		obj.addProperty("name", unique);
		obj.addProperty("short_name", unique);

		RequestSpecification request = RestAssured.given();
		if (authHeader != null) {
			request.header(authHeader);
		}
		return request
				.contentType(ContentType.JSON)
				.body(obj.toString())
				.when()
				.post("category");
	}
}
