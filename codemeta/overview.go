// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package main

import (
	"encoding/json"
	"html/template"
	"io"
)

type SoftwareBasicData struct {
	Slug           string `json:"slug"`
	BrandName      string `json:"brand_name"`
	ShortStatement string `json:"short_statement"`
}

var tmpl = template.Must(template.ParseFiles("overview.gohtml"))

func GenerateOverview(bytes []byte, writer io.Writer) error {
	var software []SoftwareBasicData
	err := json.Unmarshal(bytes, &software)
	if err != nil {
		return err
	}

	err = tmpl.Execute(writer, software)
	if err != nil {
		return err
	}

	return nil
}
